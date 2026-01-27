export interface Project {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    snLink?: string;
    center?: string;
    branch?: string;
    mador?: string;
    status: 'IN_PROCESS' | 'RESOLVED';
    createdAt: string;
    updatedAt: string;
}

export interface RequestLine {
    id: string;
    projectId: string;
    resourceType: string;
    requestedQuantity: number;
    approvedQuantity?: number;
    unit?: string;
    purpose?: string;
    status: 'PENDING' | 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
    decisionReason?: string;
}
