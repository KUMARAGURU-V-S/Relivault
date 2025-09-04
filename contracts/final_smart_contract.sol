// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EfficientDisasterRelief is ERC721URIStorage, Ownable, ReentrancyGuard {
    // ---- Claims ----
    enum ClaimStatus { PENDING, APPROVED, REJECTED, DISBURSED }

    struct Claim {
        address claimant;
        uint256 requested;
        uint256 approved;
        ClaimStatus status;
        string docsIpfs;     // IPFS CID/URI for supporting docs
    }

    // ---- Donations / NFTs ----
    uint256 public constant MIN_DONATION_FOR_NFT = 1 ether; // donate >= 1 ETH to mint a cert NFT
    uint256 public nextTokenId;

    // ---- Claims storage ----
    uint256 public nextClaimId;
    mapping(uint256 => Claim) public claims;            // claimId => Claim
    mapping(address => uint256[]) public userClaims;    // user => list of their claimIds

    // ---- Events ----
    event Donation(address indexed donor, uint256 amount, uint256 tokenId);
    event ClaimSubmitted(uint256 indexed claimId, address indexed claimant);
    event ClaimApproved(uint256 indexed claimId, uint256 amount);
    event ClaimRejected(uint256 indexed claimId);
    event FundsDisbursed(uint256 indexed claimId, address indexed to, uint256 amount);

    constructor() ERC721("ReliefDonor", "RDN") Ownable(msg.sender) {}

    /**
     * @notice Accept a donation. If amount >= MIN_DONATION_FOR_NFT, mint an NFT certificate
     *         and set its metadata URI (e.g., ipfs://<CID>/metadata.json).
     * @param ipfsMetadata URI to the ERC-721 metadata JSON on IPFS
     */
    function donate(string memory ipfsMetadata) external payable nonReentrant {
        require(msg.value > 0, "No donation");

        if (msg.value >= MIN_DONATION_FOR_NFT) {
            uint256 tokenId = nextTokenId++;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, ipfsMetadata);
            emit Donation(msg.sender, msg.value, tokenId);
        } else {
            // Small donation: no NFT, but still emit the event with tokenId = 0
            emit Donation(msg.sender, msg.value, 0);
        }
    }

    /**
     * @notice Submit a relief claim.
     * @param requested Amount requested in wei
     * @param docsIpfs  IPFS URI/CID for supporting documents
     */
    function submitClaim(uint256 requested, string memory docsIpfs) external {
        require(requested > 0, "Amount required");
        uint256 claimId = nextClaimId++;
        claims[claimId] = Claim(msg.sender, requested, 0, ClaimStatus.PENDING, docsIpfs);
        userClaims[msg.sender].push(claimId);
        emit ClaimSubmitted(claimId, msg.sender);
    }

    /**
     * @notice Approve a claim for a certain amount (cannot exceed requested).
     *         Does NOT transfer funds yet—only marks approved.
     */
    function approveClaim(uint256 claimId, uint256 approved) external onlyOwner nonReentrant {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Invalid state");
        require(approved <= c.requested, "Exceeds requested");
        require(address(this).balance >= approved, "Insufficient contract funds");
        c.status = ClaimStatus.APPROVED;
        c.approved = approved;
        emit ClaimApproved(claimId, approved);
    }

    /**
     * @notice Reject a pending claim.
     */
    function rejectClaim(uint256 claimId) external onlyOwner {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Invalid state");
        c.status = ClaimStatus.REJECTED;
        emit ClaimRejected(claimId);
    }

    /**
     * @notice Disburse approved funds to the claimant.
     */
    function disburseFunds(uint256 claimId) external onlyOwner nonReentrant {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.APPROVED, "Not approved");
        require(address(this).balance >= c.approved, "Not enough balance");
        c.status = ClaimStatus.DISBURSED;

        (bool ok, ) = payable(c.claimant).call{value: c.approved}("");
        require(ok, "Transfer failed");

        emit FundsDisbursed(claimId, c.claimant, c.approved);
    }

    function getClaimIds(address user) external view returns (uint256[] memory) {
        return userClaims[user];
    }

    function getClaim(uint256 id) external view returns (
        address, uint256, uint256, ClaimStatus, string memory
    ) {
        Claim memory c = claims[id];
        return (c.claimant, c.requested, c.approved, c.status, c.docsIpfs);
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
    fallback() external payable {}
}
