import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { query, where, getDocs, collection } from 'firebase/firestore';

import { FIRESTORE } from 'src/lib/firebase';
import { type TrainingUpdateType, sendTrainingUpdateEmail } from 'src/lib/email';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
    try {
        const { moduleId, moduleTitle, updateType, moduleUrl } = await request.json() as {
            moduleId: string;
            moduleTitle: string;
            updateType: TrainingUpdateType;
            moduleUrl: string;
        };

        if (!moduleId || !moduleTitle || !updateType || !moduleUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch all subscribers for this module
        const q = query(
            collection(FIRESTORE, 'trainingSubscriptions'),
            where('moduleId', '==', moduleId)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return NextResponse.json({ status: 'no_subscribers', sent: 0 });
        }

        const subscribers = snapshot.docs.map((d) => ({
            email: d.data().userEmail as string,
            name: d.data().userName as string,
        }));

        // Send email to each subscriber
        const results = await Promise.allSettled(
            subscribers.map((sub) =>
                sendTrainingUpdateEmail(sub.email, sub.name, moduleTitle, updateType, moduleUrl)
            )
        );

        const sent = results.filter((r) => r.status === 'fulfilled' && r.value === true).length;
        const failed = results.length - sent;

        return NextResponse.json({
            status: 'done',
            total: subscribers.length,
            sent,
            failed,
        });
    } catch (error) {
        console.error('Training send-update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
