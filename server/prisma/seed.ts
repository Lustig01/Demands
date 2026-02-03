import { PrismaClient, ProjectType, Median, DemandType, DemandStatus } from '@prisma/client';

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

  // Keycloak users (username = username, since UUIDs are generated at realm import)
  const USERS = {
    admin1: { username: 'admin1', name: 'Admin One' },
    admin2: { username: 'admin2', name: 'Admin Two' },
    mod1: { username: 'mod1', name: 'Moderator One' },
    mod2: { username: 'mod2', name: 'Moderator Two' },
    user1: { username: 'user1', name: 'User One' },
    user2: { username: 'user2', name: 'User Two' },
    user3: { username: 'user3', name: 'User Three' },
  };

  const creators = [USERS.user1, USERS.user2, USERS.user3];

  // ============================================
  // Project Kind Models
  // ============================================

  const projectKinds = await Promise.all([
    prisma.projectKind.upsert({
      where: { name: 'App' },
      update: {},
      create: { name: 'App' },
    }),
    prisma.projectKind.upsert({
      where: { name: 'Track' },
      update: {},
      create: { name: 'Track' },
    }),
  ]);
  console.log(`Created ${projectKinds.length} project kinds`);

  const projectList = [
    { name: 'Cloud Migration', purpose: 'Migrate legacy apps to cloud', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H1 },
    { name: 'Database Upgrade', purpose: 'Upgrade PostgreSQL clusters', type: ProjectType.Emergency, kind: 'Track', year: undefined, median: undefined },
    { name: 'New API Platform', purpose: 'Build new API gateway', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2 },
    { name: 'DR Setup', purpose: 'Setup disaster recovery site', type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1 },
    { name: 'Dev Environment', purpose: 'New development environment', type: ProjectType.Emergency, kind: 'App', year: undefined, median: undefined },
    { name: 'Legacy Decom', purpose: 'Decommission old servers', type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1 },
    { name: 'AI Research', purpose: 'AI model training infrastructure', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2 },
    { name: 'Network Refresh', purpose: 'Upgrade core switches', type: ProjectType.Emergency, kind: 'Track', year: 2026, median: Median.H1 },
    { name: 'Storage Expansion', purpose: 'Add more storage capacity', type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H2 },
    { name: 'Kubernetes Upgrade', purpose: 'Upgrade K8s clusters', type: ProjectType.Emergency, kind: 'Track', year: 2026, median: Median.H1 },
    { name: 'Security Audit', purpose: 'Infrastructure for security audit', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2 },
    { name: 'Big Data Platform', purpose: 'Hadoop cluster setup', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H1 },
    { name: 'CRM Integration', purpose: 'Integrate new CRM system', type: ProjectType.Emergency, kind: 'App', year: 2026, median: Median.H2 },
    { name: 'ERP Migration', purpose: 'Migrate ERP to cloud', type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1 },
    { name: 'Mobile App Backend', purpose: 'Backend for new mobile app', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2 },
  ];

  const projects = await Promise.all(
    projectList.map((p, index) => {
      const creator = creators[index % creators.length];
      const location = locations[index % locations.length];
      return prisma.project.upsert({
        where: { name: p.name },
        update: {},
        create: {
          name: p.name,
          purpose: p.purpose,
          type: p.type,
          kindName: p.kind,
          locationId: location.id,
          year: p.year,
          median: p.median,
          createdBy: creator.username,
          createdByName: creator.name,
        },
      });
    })
  );
  console.log(`Created ${projects.length} projects`);

  // Clear existing demands to avoid duplicates
  await prisma.demand.deleteMany({
    where: {
      projectName: { in: projects.map((p) => p.name) },
    },
  });

  const resourceOptions = [
    { serviceName: 'Compute', resourceName: 'CPU', resourceService: 'Compute', unit: 'vCPU', maxVal: 500 },
    { serviceName: 'Compute', resourceName: 'RAM', resourceService: 'Compute', unit: 'GB', maxVal: 1024 },
    { serviceName: 'Storage', resourceName: 'SSD', resourceService: 'Storage', unit: 'TB', maxVal: 100 },
    { serviceName: 'Network', resourceName: 'Bandwidth', resourceService: 'Network', unit: 'Gbps', maxVal: 10 },
    { serviceName: 'Container', resourceName: 'Pods', resourceService: 'Container', unit: 'units', maxVal: 50 },
  ];

  // Need at least 50 demands
  const demandPromises = [];
  const statuses = [DemandStatus.Pending, DemandStatus.Approved, DemandStatus.Rejected, DemandStatus.PartiallyApproved];
  const types = [DemandType.New, DemandType.Extension];

  for (let i = 0; i < 50; i++) {
    const project = projects[i % projects.length];
    const resource = resourceOptions[i % resourceOptions.length];
    const creator = creators[i % creators.length];
    const status = statuses[i % statuses.length];
    const type = types[i % types.length];

    const val = Math.floor(Math.random() * resource.maxVal) + 1;

    let approvedValue = undefined;
    let approvedDate = undefined;

    if (status === DemandStatus.Approved) {
      approvedValue = val;
      approvedDate = new Date();
    } else if (status === DemandStatus.PartiallyApproved) {
      approvedValue = Math.floor(val * 0.8);
      approvedDate = new Date();
    }

    demandPromises.push(
      prisma.demand.create({
        data: {
          projectName: project.name,
          serviceName: resource.serviceName,
          resourceName: resource.resourceName,
          resourceService: resource.resourceService,
          value: val,
          locationId: project.locationId,
          type: type,
          status: status,
          approvedValue,
          approvedDate,
          createdBy: creator.username,
          createdByName: creator.name,
        },
      })
    );
  }

  const demands = await Promise.all(demandPromises);
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
      status: DemandStatus.Rejected
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
