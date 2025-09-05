import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// GET: Fetch all pending verification requests
export async function GET() {
  try {
    const q = query(
      collection(db, 'verificationRequests'),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new verification request
export async function POST(request: Request) {
  try {
    const { userId, walletAddress, userName } = await request.json();

    if (!userId || !walletAddress || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing pending requests for this user or wallet to avoid duplicates
    const existingQuery = query(
      collection(db, 'verificationRequests'),
      where('userId', '==', userId),
      where('status', '==', 'pending')
    );
    const existingSnapshot = await getDocs(existingQuery);
    if (!existingSnapshot.empty) {
      return NextResponse.json({ message: 'A pending request already exists for this user.' }, { status: 200 });
    }

    const docRef = await addDoc(collection(db, 'verificationRequests'), {
      userId,
      walletAddress,
      userName,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Verification request created', id: docRef.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a request's status (e.g., to 'approved')
export async function PUT(request: Request) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const requestRef = doc(db, 'verificationRequests', requestId);
    await updateDoc(requestRef, {
      status: 'approved',
    });

    return NextResponse.json({ message: 'Verification request approved' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
