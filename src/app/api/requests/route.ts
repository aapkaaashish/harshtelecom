import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

// GET /api/requests - Get all requests (admin) or user's requests (technician)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user?.role;
    const userEmail = session.user?.email;

    let requests;

    if (userRole === 'admin') {
      // Admin sees all requests
      requests = await prisma.partsRequest.findMany({
        orderBy: { requestTime: 'desc' },
      });
    } else {
      // Technicians see only their requests
      requests = await prisma.partsRequest.findMany({
        where: { technicianEmail: userEmail! },
        orderBy: { requestTime: 'desc' },
      });
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/requests - Create new request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      technicianName,
      technicianEmail,
      partType,
      quantity,
      urgency,
      notes,
    } = body;

    // Validate required fields
    if (!technicianName || !technicianEmail || !partType || !quantity || !urgency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure technician can only create requests for themselves
    if (session.user?.email !== technicianEmail) {
      return NextResponse.json({ error: 'Cannot create requests for other users' }, { status: 403 });
    }

    const newRequest = await prisma.partsRequest.create({
      data: {
        technicianName,
        technicianEmail,
        partType,
        quantity: parseInt(quantity),
        urgency,
        notes: notes || '',
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}