# Firebase Auth UID Migration Guide

This guide will help you migrate your existing Firestore data to use Firebase Auth UIDs instead of custom user IDs.

## ✅ What's Been Updated

### 1. **Components Updated to Use Firebase Auth UIDs:**
- ✅ `components/forms/claim-form.tsx` - Now uses `user.uid` from Firebase Auth
- ✅ `components/dashboards/victim-dashboard.tsx` - Uses real Firebase Auth UID
- ✅ `components/dashboards/donor-dashboard.tsx` - Uses real Firebase Auth UID  
- ✅ `components/dashboards/ngo-dashboard.tsx` - Uses real Firebase Auth UID

### 2. **Migration Scripts Created:**
- ✅ `scripts/createUserMapping.js` - Analyzes current data and suggests mappings
- ✅ `scripts/updateFirestoreUIDs.js` - Basic migration script
- ✅ `scripts/runMigration.js` - Interactive migration tool (recommended)

## 🚀 Migration Steps

### Step 1: Set up Environment Variables

Create a `.env.local` file with your Firebase Admin credentials:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Step 2: Install Dependencies

```bash
npm install firebase-admin
```

### Step 3: Run the Interactive Migration Tool

```bash
node scripts/runMigration.js
```

This interactive tool will:
1. 🔍 Analyze your current Firebase Auth users and Firestore data
2. 📝 Help you create mappings between old custom IDs and Firebase Auth UIDs
3. 🔄 Perform the migration with confirmation
4. ✅ Verify the results

### Alternative: Manual Migration

If you prefer manual control:

1. **Analyze current data:**
   ```bash
   node scripts/createUserMapping.js
   ```

2. **Edit the mapping in `scripts/updateFirestoreUIDs.js`:**
   ```javascript
   const userIdMapping = {
     'demo-victim-123': 'actual-firebase-uid-1',
     'demo-donor-456': 'actual-firebase-uid-2',
     // Add your mappings here
   };
   ```

3. **Run the migration:**
   ```bash
   node scripts/updateFirestoreUIDs.js
   ```

## 📊 What Gets Updated

### Collections Affected:
- **`ipfs_cids`** - All documents with `userId` field will be updated to use Firebase Auth UIDs

### Fields Updated:
- `userId` - Changed from custom IDs (like "demo-victim-123") to Firebase Auth UIDs
- `updatedAt` - Set to current timestamp
- `migrationNote` - Added to track the migration

## 🔍 Verification

After migration, verify that:

1. **All `ipfs_cids` documents use Firebase Auth UIDs:**
   - Check Firebase Console → Firestore → `ipfs_cids` collection
   - Ensure all `userId` fields contain Firebase Auth UIDs

2. **Components work correctly:**
   - Test victim dashboard - should show user-specific claims
   - Test donor dashboard - should show user-specific donations
   - Test NGO dashboard - should work with authenticated NGO users
   - Test claim form - should submit with correct Firebase Auth UID

3. **Data integrity:**
   - Claims are linked to correct users
   - IPFS documents are associated with right users

## 🚨 Important Notes

### Before Migration:
- ✅ Backup your Firestore database
- ✅ Ensure all users are created in Firebase Auth
- ✅ Test with a small dataset first

### After Migration:
- ✅ Old custom IDs will be preserved in `migrationNote` field
- ✅ All new data will automatically use Firebase Auth UIDs
- ✅ Components will work with authenticated users only

## 🔧 Troubleshooting

### Issue: "No Firebase Auth users found"
**Solution:** Create users in Firebase Auth first, or import existing users

### Issue: "Document ID doesn't match uid field"
**Solution:** This is normal - document IDs in `users` collection should match Firebase Auth UIDs

### Issue: Components not loading data
**Solution:** Ensure user is authenticated and has the correct role

### Issue: Migration script fails
**Solution:** Check environment variables and Firebase Admin permissions

## 📈 Benefits After Migration

- ✅ **Consistent User References** - Both collections use Firebase Auth UIDs
- ✅ **Better Security** - Real authentication-based user identification  
- ✅ **Proper Data Linking** - Claims and IPFS documents properly linked to authenticated users
- ✅ **No More Hardcoded IDs** - Dynamic user identification based on actual authentication
- ✅ **Scalable Architecture** - Ready for production with real users

## 🎯 Next Steps

After successful migration:

1. **Test all user flows** with real Firebase Auth users
2. **Update any remaining hardcoded IDs** in other parts of your application
3. **Set up proper Firestore security rules** based on Firebase Auth UIDs
4. **Deploy to production** with confidence

Your disaster relief system is now properly integrated with Firebase Auth! 🎉