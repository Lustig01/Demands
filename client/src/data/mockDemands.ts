import type { Demand, DemandType, DemandStatus, DemandLocation } from '../types/domain';

const PROJECTS = ['Alpha Upgrade', 'Beta Migration', 'Gamma Expansion', 'Delta Reliability', 'Epsilon Security', 'Zeta Cloud', 'Theta Analytics', 'Iota AI', 'Kappa Mobile', 'Lambda Web'];
const SERVICES = ['Authentication', 'Database', 'Messaging', 'Storage', 'Compute', 'Networking', 'Monitoring', 'Logging', 'Billing', 'Notification'];
const RESOURCES = ['CPU', 'RAM', 'Disk', 'Bandwidth', 'GPU', 'TPU'];
const RESOURCE_SERVICES = ['AWS EC2', 'AWS S3', 'AWS RDS', 'GCP Compute', 'GCP Storage', 'Azure VO', 'Azure Blob'];
const BASES = ['US-East', 'US-West', 'EU-Central', 'EU-West', 'Asia-East', 'Asia-South'];
const ENVIRONMENTS = ['Development', 'Staging', 'Production', 'QA', 'UAT'];
const NETWORKS = ['Public', 'Private', 'Restricted', 'Internal'];
const TYPES: DemandType[] = ['New', 'Extension'];
const STATUSES: DemandStatus[] = ['Pending', 'Approved', 'Rejected', 'PartiallyApproved'];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): string {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

export const mockDemands: Demand[] = Array.from({ length: 150 }).map((_, index) => {
    const status = getRandomItem(STATUSES);
    const location: DemandLocation = {
        base: getRandomItem(BASES),
        environment: getRandomItem(ENVIRONMENTS),
        network: getRandomItem(NETWORKS),
    };

    const item: Demand = {
        id: 1000 + index,
        projectName: getRandomItem(PROJECTS),
        serviceName: getRandomItem(SERVICES),
        resourceName: getRandomItem(RESOURCES),
        resourceService: getRandomItem(RESOURCE_SERVICES),
        unit: getRandomItem(['Core', 'GB', 'TB', 'Mbps']),
        value: Math.floor(Math.random() * 100) + 1,
        type: getRandomItem(TYPES),
        location,
        status,
        createdBy: `user${Math.floor(Math.random() * 10) + 1}`,
        createdByName: `User ${Math.floor(Math.random() * 10) + 1}`,
        createdAt: getRandomDate(new Date(2025, 0, 1), new Date()),
    };

    if (status === 'Approved' || status === 'PartiallyApproved') {
        item.approvedValue = status === 'Approved' ? item.value : Math.floor(item.value * 0.8);
        item.approvedDate = getRandomDate(new Date(item.createdAt), new Date());
        item.decisionReasonName = 'Capacity Available';
    } else if (status === 'Rejected') {
        item.decisionReasonName = 'No Capacity';
    }

    return item;
});
