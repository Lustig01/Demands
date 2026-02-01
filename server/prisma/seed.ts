import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================
  // Organization Models
  // ============================================

  const centers = await Promise.all([
    prisma.center.upsert({
      where: { name: 'IT Center' },
      update: {},
      create: { name: 'IT Center', displayName: 'Information Technology Center' },
    }),
    prisma.center.upsert({
      where: { name: 'Operations Center' },
      update: {},
      create: { name: 'Operations Center', displayName: 'Global Operations Center' },
    }),
    prisma.center.upsert({
      where: { name: 'Finance Center' },
      update: {},
      create: { name: 'Finance Center', displayName: 'Central Finance' },
    }),
    prisma.center.upsert({
      where: { name: 'HR Center' },
      update: {},
      create: { name: 'HR Center', displayName: 'Human Resources' },
    }),
    prisma.center.upsert({
      where: { name: 'Research Center' },
      update: {},
      create: { name: 'Research Center', displayName: 'R&D Center' },
    }),
  ]);
  console.log(`Created ${centers.length} centers`);

  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Development', centerName: 'IT Center' } },
      update: {},
      create: { name: 'Development', centerName: 'IT Center', displayName: 'Software Development' },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Infrastructure', centerName: 'IT Center' } },
      update: {},
      create: { name: 'Infrastructure', centerName: 'IT Center', displayName: 'IT Infrastructure' },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Logistics', centerName: 'Operations Center' } },
      update: {},
      create: { name: 'Logistics', centerName: 'Operations Center', displayName: 'Supply Chain & Logistics' },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Accounting', centerName: 'Finance Center' } },
      update: {},
      create: { name: 'Accounting', centerName: 'Finance Center', displayName: 'Corporate Accounting' },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Recruitment', centerName: 'HR Center' } },
      update: {},
      create: { name: 'Recruitment', centerName: 'HR Center', displayName: 'Talent Acquisition' },
    }),
  ]);
  console.log(`Created ${branches.length} branches`);

  const sections = await Promise.all([
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Backend Team', branchName: 'Development', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Backend Team', branchName: 'Development', branchCenter: 'IT Center', displayName: 'Backend Engineering' },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Frontend Team', branchName: 'Development', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Frontend Team', branchName: 'Development', branchCenter: 'IT Center', displayName: 'Frontend Engineering' },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Cloud Team', branchName: 'Infrastructure', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Cloud Team', branchName: 'Infrastructure', branchCenter: 'IT Center', displayName: 'Cloud Operations' },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Warehouse', branchName: 'Logistics', branchCenter: 'Operations Center' } },
      update: {},
      create: { name: 'Warehouse', branchName: 'Logistics', branchCenter: 'Operations Center', displayName: 'Main Warehouse' },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Payroll', branchName: 'Accounting', branchCenter: 'Finance Center' } },
      update: {},
      create: { name: 'Payroll', branchName: 'Accounting', branchCenter: 'Finance Center', displayName: 'Payroll Department' },
    }),
  ]);
  console.log(`Created ${sections.length} sections`);

  // ============================================
  // Location Models
  // ============================================

  const bases = await Promise.all([
    prisma.base.upsert({ where: { name: 'Datacenter A' }, update: {}, create: { name: 'Datacenter A', displayName: 'Primary DC' } }),
    prisma.base.upsert({ where: { name: 'Datacenter B' }, update: {}, create: { name: 'Datacenter B', displayName: 'Secondary DC' } }),
    prisma.base.upsert({ where: { name: 'Cloud AWS' }, update: {}, create: { name: 'Cloud AWS', displayName: 'AWS Cloud Region' } }),
    prisma.base.upsert({ where: { name: 'Cloud Azure' }, update: {}, create: { name: 'Cloud Azure', displayName: 'Azure Cloud Region' } }),
    prisma.base.upsert({ where: { name: 'Edge Site' }, update: {}, create: { name: 'Edge Site', displayName: 'Remote Edge Location' } }),
  ]);
  console.log(`Created ${bases.length} bases`);

  const environments = await Promise.all([
    prisma.environment.upsert({ where: { name: 'Production' }, update: {}, create: { name: 'Production', displayName: 'Prod Env' } }),
    prisma.environment.upsert({ where: { name: 'Staging' }, update: {}, create: { name: 'Staging', displayName: 'Staging Env' } }),
    prisma.environment.upsert({ where: { name: 'Development' }, update: {}, create: { name: 'Development', displayName: 'Dev Env' } }),
    prisma.environment.upsert({ where: { name: 'QA' }, update: {}, create: { name: 'QA', displayName: 'QA Env' } }),
    prisma.environment.upsert({ where: { name: 'DR' }, update: {}, create: { name: 'DR', displayName: 'Disaster Recovery' } }),
  ]);
  console.log(`Created ${environments.length} environments`);

  const networks = await Promise.all([
    prisma.network.upsert({ where: { name: 'Internal' }, update: {}, create: { name: 'Internal', displayName: 'Internal Network' } }),
    prisma.network.upsert({ where: { name: 'DMZ' }, update: {}, create: { name: 'DMZ', displayName: 'De-Militarized Zone' } }),
    prisma.network.upsert({ where: { name: 'Public' }, update: {}, create: { name: 'Public', displayName: 'Public Internet' } }),
    prisma.network.upsert({ where: { name: 'Private VPC' }, update: {}, create: { name: 'Private VPC', displayName: 'Private VPC Network' } }),
    prisma.network.upsert({ where: { name: 'Isolated' }, update: {}, create: { name: 'Isolated', displayName: 'Air-Gapped Network' } }),
  ]);
  console.log(`Created ${networks.length} networks`);

  const locations = await Promise.all([
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter A', environmentName: 'Production', networkName: 'Internal' } },
      update: {},
      create: { baseName: 'Datacenter A', environmentName: 'Production', networkName: 'Internal' },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter A', environmentName: 'Staging', networkName: 'Internal' } },
      update: {},
      create: { baseName: 'Datacenter A', environmentName: 'Staging', networkName: 'Internal' },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Cloud AWS', environmentName: 'Production', networkName: 'Private VPC' } },
      update: {},
      create: { baseName: 'Cloud AWS', environmentName: 'Production', networkName: 'Private VPC' },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Cloud AWS', environmentName: 'Development', networkName: 'Private VPC' } },
      update: {},
      create: { baseName: 'Cloud AWS', environmentName: 'Development', networkName: 'Private VPC' },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter B', environmentName: 'DR', networkName: 'Isolated' } },
      update: {},
      create: { baseName: 'Datacenter B', environmentName: 'DR', networkName: 'Isolated' },
    }),
  ]);
  console.log(`Created ${locations.length} locations`);

  // ============================================
  // Service Models
  // ============================================

  const services = await Promise.all([
    prisma.service.upsert({ where: { name: 'Compute' }, update: {}, create: { name: 'Compute' } }),
    prisma.service.upsert({ where: { name: 'Storage' }, update: {}, create: { name: 'Storage' } }),
    prisma.service.upsert({ where: { name: 'Network' }, update: {}, create: { name: 'Network' } }),
    prisma.service.upsert({ where: { name: 'Database' }, update: {}, create: { name: 'Database' } }),
    prisma.service.upsert({ where: { name: 'Container' }, update: {}, create: { name: 'Container' } }),
  ]);
  console.log(`Created ${services.length} services`);

  const resources = await Promise.all([
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'CPU', serviceName: 'Compute' } },
      update: {},
      create: { name: 'CPU', unit: 'vCPU', serviceName: 'Compute' },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'RAM', serviceName: 'Compute' } },
      update: {},
      create: { name: 'RAM', unit: 'GB', serviceName: 'Compute' },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'SSD', serviceName: 'Storage' } },
      update: {},
      create: { name: 'SSD', unit: 'TB', serviceName: 'Storage' },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'Bandwidth', serviceName: 'Network' } },
      update: {},
      create: { name: 'Bandwidth', unit: 'Gbps', serviceName: 'Network' },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'Pods', serviceName: 'Container' } },
      update: {},
      create: { name: 'Pods', unit: 'units', serviceName: 'Container' },
    }),
  ]);
  console.log(`Created ${resources.length} resources`);

  const capacities = await Promise.all([
    prisma.capacity.upsert({
      where: { locationId_resourceName_resourceService: { locationId: locations[0].id, resourceName: 'CPU', resourceService: 'Compute' } },
      update: {},
      create: { locationId: locations[0].id, resourceName: 'CPU', resourceService: 'Compute', value: 1000 },
    }),
    prisma.capacity.upsert({
      where: { locationId_resourceName_resourceService: { locationId: locations[0].id, resourceName: 'RAM', resourceService: 'Compute' } },
      update: {},
      create: { locationId: locations[0].id, resourceName: 'RAM', resourceService: 'Compute', value: 4096 },
    }),
    prisma.capacity.upsert({
      where: { locationId_resourceName_resourceService: { locationId: locations[0].id, resourceName: 'SSD', resourceService: 'Storage' } },
      update: {},
      create: { locationId: locations[0].id, resourceName: 'SSD', resourceService: 'Storage', value: 100 },
    }),
    prisma.capacity.upsert({
      where: { locationId_resourceName_resourceService: { locationId: locations[2].id, resourceName: 'CPU', resourceService: 'Compute' } },
      update: {},
      create: { locationId: locations[2].id, resourceName: 'CPU', resourceService: 'Compute', value: 2000 },
    }),
    prisma.capacity.upsert({
      where: { locationId_resourceName_resourceService: { locationId: locations[2].id, resourceName: 'RAM', resourceService: 'Compute' } },
      update: {},
      create: { locationId: locations[2].id, resourceName: 'RAM', resourceService: 'Compute', value: 8192 },
    }),
  ]);
  console.log(`Created ${capacities.length} capacities`);

  // ============================================
  // Request Models
  // ============================================

  const projects = await Promise.all([
    prisma.project.upsert({
      where: { name: 'Cloud Migration' },
      update: {},
      create: { name: 'Cloud Migration', purpose: 'Migrate legacy apps to cloud', type: 'Semiannual', kind: 'App', locationId: locations[2].id, year: 2026, median: 'H1' },
    }),
    prisma.project.upsert({
      where: { name: 'Database Upgrade' },
      update: {},
      create: { name: 'Database Upgrade', purpose: 'Upgrade PostgreSQL clusters', type: 'Emergency', kind: 'Track', locationId: locations[0].id },
    }),
    prisma.project.upsert({
      where: { name: 'New API Platform' },
      update: {},
      create: { name: 'New API Platform', purpose: 'Build new API gateway', type: 'Semiannual', kind: 'App', locationId: locations[0].id, year: 2026, median: 'H2' },
    }),
    prisma.project.upsert({
      where: { name: 'DR Setup' },
      update: {},
      create: { name: 'DR Setup', purpose: 'Setup disaster recovery site', type: 'Semiannual', kind: 'Track', locationId: locations[4].id, year: 2026, median: 'H1' },
    }),
    prisma.project.upsert({
      where: { name: 'Dev Environment' },
      update: {},
      create: { name: 'Dev Environment', purpose: 'New development environment', type: 'Emergency', kind: 'App', locationId: locations[3].id },
    }),
  ]);
  console.log(`Created ${projects.length} projects`);

  // Clear existing demands to avoid duplicates
  await prisma.demand.deleteMany({
    where: {
      projectName: { in: projects.map(p => p.name) }
    }
  });

  const demands = await Promise.all([
    prisma.demand.create({
      data: {
        projectName: 'Cloud Migration',
        serviceName: 'Compute',
        resourceName: 'CPU',
        resourceService: 'Compute',
        value: 200,
        locationId: locations[2].id,
        type: 'New',
        status: 'Pending',
      },
    }),
    prisma.demand.create({
      data: {
        projectName: 'Cloud Migration',
        serviceName: 'Compute',
        resourceName: 'RAM',
        resourceService: 'Compute',
        value: 512,
        locationId: locations[2].id,
        type: 'New',
        status: 'Approved',
        approvedValue: 512,
        approvedDate: new Date(),
      },
    }),
    prisma.demand.create({
      data: {
        projectName: 'Database Upgrade',
        serviceName: 'Storage',
        resourceName: 'SSD',
        resourceService: 'Storage',
        value: 50,
        locationId: locations[0].id,
        type: 'Extension',
        status: 'Approved',
        approvedValue: 50,
        approvedDate: new Date(),
      },
    }),
    prisma.demand.create({
      data: {
        projectName: 'New API Platform',
        serviceName: 'Compute',
        resourceName: 'CPU',
        resourceService: 'Compute',
        value: 100,
        locationId: locations[0].id,
        type: 'New',
        status: 'PartiallyApproved',
        approvedValue: 80,
        approvedDate: new Date(),
      },
    }),
    prisma.demand.create({
      data: {
        projectName: 'DR Setup',
        serviceName: 'Compute',
        resourceName: 'CPU',
        resourceService: 'Compute',
        value: 150,
        locationId: locations[4].id,
        type: 'New',
        status: 'Rejected',
      },
    }),
  ]);
  console.log(`Created ${demands.length} demands`);

  // Update allocated and available using PostgreSQL functions
  await prisma.$executeRaw`
    UPDATE "Capacity"
    SET
      "allocated" = calculate_allocated(id),
      "available" = calculate_available(id)
  `;

  console.log('Updated capacity allocated and available values');

  // ============================================
  // Decision Reason Models
  // ============================================

  const decisionReasons = await Promise.all([
    prisma.decisionReason.upsert({
      where: { name: 'Budget' },
      update: {},
      create: { name: 'Budget', displayName: 'Budget Constraints' },
    }),
    prisma.decisionReason.upsert({
      where: { name: 'Capacity' },
      update: {},
      create: { name: 'Capacity', displayName: 'Capacity Constraints' },
    }),
    prisma.decisionReason.upsert({
      where: { name: 'Strategic' },
      update: {},
      create: { name: 'Strategic', displayName: 'Strategic Decision' },
    }),
  ]);
  console.log(`Created ${decisionReasons.length} decision reasons`);

  // Link a demand to a decision reason
  const demandToUpdate = await prisma.demand.findFirst({
    where: {
      status: 'Rejected'
    }
  });

  if (demandToUpdate) {
    await prisma.demand.update({
      where: { id: demandToUpdate.id },
      data: { decisionReasonName: 'Budget' }
    });
    console.log('Updated a demand with decision reason');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
