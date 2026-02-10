import { PrismaClient, ProjectType, Median, DemandType, DemandStatus, Priority } from '@prisma/client';

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
      create: { name: 'IT Center', displayName: 'Information Technology Center', isActive: true },
    }),
    prisma.center.upsert({
      where: { name: 'Operations Center' },
      update: {},
      create: { name: 'Operations Center', displayName: 'Global Operations Center', isActive: true },
    }),
    prisma.center.upsert({
      where: { name: 'Finance Center' },
      update: {},
      create: { name: 'Finance Center', displayName: 'Central Finance', isActive: true },
    }),
    prisma.center.upsert({
      where: { name: 'HR Center' },
      update: {},
      create: { name: 'HR Center', displayName: 'Human Resources', isActive: true },
    }),
    prisma.center.upsert({
      where: { name: 'Research Center' },
      update: {},
      create: { name: 'Research Center', displayName: 'R&D Center', isActive: true },
    }),
  ]);
  console.log(`Created ${centers.length} centers`);

  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Development', centerName: 'IT Center' } },
      update: {},
      create: { name: 'Development', centerName: 'IT Center', displayName: 'Software Development', isActive: true },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Infrastructure', centerName: 'IT Center' } },
      update: {},
      create: { name: 'Infrastructure', centerName: 'IT Center', displayName: 'IT Infrastructure', isActive: true },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Logistics', centerName: 'Operations Center' } },
      update: {},
      create: { name: 'Logistics', centerName: 'Operations Center', displayName: 'Supply Chain & Logistics', isActive: true },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Accounting', centerName: 'Finance Center' } },
      update: {},
      create: { name: 'Accounting', centerName: 'Finance Center', displayName: 'Corporate Accounting', isActive: true },
    }),
    prisma.branch.upsert({
      where: { name_centerName: { name: 'Recruitment', centerName: 'HR Center' } },
      update: {},
      create: { name: 'Recruitment', centerName: 'HR Center', displayName: 'Talent Acquisition', isActive: true },
    }),
  ]);
  console.log(`Created ${branches.length} branches`);

  const sections = await Promise.all([
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Backend Team', branchName: 'Development', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Backend Team', branchName: 'Development', branchCenter: 'IT Center', displayName: 'Backend Engineering', isActive: true },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Frontend Team', branchName: 'Development', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Frontend Team', branchName: 'Development', branchCenter: 'IT Center', displayName: 'Frontend Engineering', isActive: true },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Cloud Team', branchName: 'Infrastructure', branchCenter: 'IT Center' } },
      update: {},
      create: { name: 'Cloud Team', branchName: 'Infrastructure', branchCenter: 'IT Center', displayName: 'Cloud Operations', isActive: true },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Warehouse', branchName: 'Logistics', branchCenter: 'Operations Center' } },
      update: {},
      create: { name: 'Warehouse', branchName: 'Logistics', branchCenter: 'Operations Center', displayName: 'Main Warehouse', isActive: true },
    }),
    prisma.section.upsert({
      where: { name_branchName_branchCenter: { name: 'Payroll', branchName: 'Accounting', branchCenter: 'Finance Center' } },
      update: {},
      create: { name: 'Payroll', branchName: 'Accounting', branchCenter: 'Finance Center', displayName: 'Payroll Department', isActive: true },
    }),
  ]);
  console.log(`Created ${sections.length} sections`);

  // ============================================
  // Location Models
  // ============================================

  const bases = await Promise.all([
    prisma.base.upsert({ where: { name: 'Datacenter A' }, update: {}, create: { name: 'Datacenter A', displayName: 'Primary DC', isActive: true } }),
    prisma.base.upsert({ where: { name: 'Datacenter B' }, update: {}, create: { name: 'Datacenter B', displayName: 'Secondary DC', isActive: true } }),
    prisma.base.upsert({ where: { name: 'Cloud AWS' }, update: {}, create: { name: 'Cloud AWS', displayName: 'AWS Cloud Region', isActive: true } }),
    prisma.base.upsert({ where: { name: 'Cloud Azure' }, update: {}, create: { name: 'Cloud Azure', displayName: 'Azure Cloud Region', isActive: true } }),
    prisma.base.upsert({ where: { name: 'Edge Site' }, update: {}, create: { name: 'Edge Site', displayName: 'Remote Edge Location', isActive: true } }),
  ]);
  console.log(`Created ${bases.length} bases`);

  const environments = await Promise.all([
    prisma.environment.upsert({ where: { name: 'Production' }, update: {}, create: { name: 'Production', displayName: 'Prod Env', isActive: true } }),
    prisma.environment.upsert({ where: { name: 'Staging' }, update: {}, create: { name: 'Staging', displayName: 'Staging Env', isActive: true } }),
    prisma.environment.upsert({ where: { name: 'Development' }, update: {}, create: { name: 'Development', displayName: 'Dev Env', isActive: true } }),
    prisma.environment.upsert({ where: { name: 'QA' }, update: {}, create: { name: 'QA', displayName: 'QA Env', isActive: true } }),
    prisma.environment.upsert({ where: { name: 'DR' }, update: {}, create: { name: 'DR', displayName: 'Disaster Recovery', isActive: true } }),
  ]);
  console.log(`Created ${environments.length} environments`);

  const networks = await Promise.all([
    prisma.network.upsert({ where: { name: 'Internal' }, update: {}, create: { name: 'Internal', displayName: 'Internal Network', isActive: true } }),
    prisma.network.upsert({ where: { name: 'DMZ' }, update: {}, create: { name: 'DMZ', displayName: 'De-Militarized Zone', isActive: true } }),
    prisma.network.upsert({ where: { name: 'Public' }, update: {}, create: { name: 'Public', displayName: 'Public Internet', isActive: true } }),
    prisma.network.upsert({ where: { name: 'Private VPC' }, update: {}, create: { name: 'Private VPC', displayName: 'Private VPC Network', isActive: true } }),
    prisma.network.upsert({ where: { name: 'Isolated' }, update: {}, create: { name: 'Isolated', displayName: 'Air-Gapped Network', isActive: true } }),
  ]);
  console.log(`Created ${networks.length} networks`);

  const locations = await Promise.all([
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter A', environmentName: 'Production', networkName: 'Internal' } },
      update: {},
      create: { baseName: 'Datacenter A', environmentName: 'Production', networkName: 'Internal', isActive: true },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter A', environmentName: 'Staging', networkName: 'Internal' } },
      update: {},
      create: { baseName: 'Datacenter A', environmentName: 'Staging', networkName: 'Internal', isActive: true },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Cloud AWS', environmentName: 'Production', networkName: 'Private VPC' } },
      update: {},
      create: { baseName: 'Cloud AWS', environmentName: 'Production', networkName: 'Private VPC', isActive: true },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Cloud AWS', environmentName: 'Development', networkName: 'Private VPC' } },
      update: {},
      create: { baseName: 'Cloud AWS', environmentName: 'Development', networkName: 'Private VPC', isActive: true },
    }),
    prisma.location.upsert({
      where: { baseName_environmentName_networkName: { baseName: 'Datacenter B', environmentName: 'DR', networkName: 'Isolated' } },
      update: {},
      create: { baseName: 'Datacenter B', environmentName: 'DR', networkName: 'Isolated', isActive: true },
    }),
  ]);
  console.log(`Created ${locations.length} locations`);

  // ============================================
  // Service Models
  // ============================================

  // Service moderator assignments - each service has at least 1 responsible moderator
  // Moderators: mod1-mod7 (defined in Keycloak realm)
  const services = await Promise.all([
    prisma.service.upsert({
      where: { name: 'Compute' },
      update: { moderators: ['mod1', 'mod2'] },
      create: { name: 'Compute', moderators: ['mod1', 'mod2'], isActive: true },
    }),
    prisma.service.upsert({
      where: { name: 'Storage' },
      update: { moderators: ['mod3', 'mod4'] },
      create: { name: 'Storage', moderators: ['mod3', 'mod4'], isActive: true },
    }),
    prisma.service.upsert({
      where: { name: 'Network' },
      update: { moderators: ['mod5'] },
      create: { name: 'Network', moderators: ['mod5'], isActive: true },
    }),
    prisma.service.upsert({
      where: { name: 'Database' },
      update: { moderators: ['mod6', 'mod1'] },
      create: { name: 'Database', moderators: ['mod6', 'mod1'], isActive: true },
    }),
    prisma.service.upsert({
      where: { name: 'Container' },
      update: { moderators: ['mod7', 'mod2'] },
      create: { name: 'Container', moderators: ['mod7', 'mod2'], isActive: true },
    }),
  ]);
  console.log(`Created ${services.length} services`);

  const resources = await Promise.all([
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'CPU', serviceName: 'Compute' } },
      update: {},
      create: { name: 'CPU', unit: 'vCPU', serviceName: 'Compute', isActive: true },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'RAM', serviceName: 'Compute' } },
      update: {},
      create: { name: 'RAM', unit: 'GB', serviceName: 'Compute', isActive: true },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'SSD', serviceName: 'Storage' } },
      update: {},
      create: { name: 'SSD', unit: 'TB', serviceName: 'Storage', isActive: true },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'Bandwidth', serviceName: 'Network' } },
      update: {},
      create: { name: 'Bandwidth', unit: 'Gbps', serviceName: 'Network', isActive: true },
    }),
    prisma.resource.upsert({
      where: { name_serviceName: { name: 'Pods', serviceName: 'Container' } },
      update: {},
      create: { name: 'Pods', unit: 'units', serviceName: 'Container', isActive: true },
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
  // Wallet Models
  // ============================================

  const wallets = await Promise.all([
    prisma.wallet.upsert({
      where: { centerName_capacityId: { centerName: 'IT Center', capacityId: capacities[0].id } },
      update: {},
      create: { centerName: 'IT Center', capacityId: capacities[0].id, value: 500 },
    }),
    prisma.wallet.upsert({
      where: { centerName_capacityId: { centerName: 'IT Center', capacityId: capacities[1].id } },
      update: {},
      create: { centerName: 'IT Center', capacityId: capacities[1].id, value: 2048 },
    }),
    prisma.wallet.upsert({
      where: { centerName_capacityId: { centerName: 'Operations Center', capacityId: capacities[2].id } },
      update: {},
      create: { centerName: 'Operations Center', capacityId: capacities[2].id, value: 50 },
    }),
    prisma.wallet.upsert({
      where: { centerName_capacityId: { centerName: 'Finance Center', capacityId: capacities[3].id } },
      update: {},
      create: { centerName: 'Finance Center', capacityId: capacities[3].id, value: 800 },
    }),
    prisma.wallet.upsert({
      where: { centerName_capacityId: { centerName: 'Research Center', capacityId: capacities[4].id } },
      update: {},
      create: { centerName: 'Research Center', capacityId: capacities[4].id, value: 4096 },
    }),
  ]);
  console.log(`Created ${wallets.length} wallets`);

  // ============================================
  // Request Models
  // ============================================

  // Keycloak users (username = username, since UUIDs are generated at realm import)
  const USERS = {
    admin1: { username: 'admin1', name: 'Admin One' },
    admin2: { username: 'admin2', name: 'Admin Two' },
    mod1: { username: 'mod1', name: 'Moderator One' },
    mod2: { username: 'mod2', name: 'Moderator Two' },
    mod3: { username: 'mod3', name: 'Moderator Three' },
    mod4: { username: 'mod4', name: 'Moderator Four' },
    mod5: { username: 'mod5', name: 'Moderator Five' },
    mod6: { username: 'mod6', name: 'Moderator Six' },
    mod7: { username: 'mod7', name: 'Moderator Seven' },
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

  // ============================================
  // Emergency Option Models
  // ============================================

  const emergencyOptions = await Promise.all([
    prisma.emergencyOption.upsert({
      where: { name: 'Security Breach' },
      update: {},
      create: { name: 'Security Breach' },
    }),
    prisma.emergencyOption.upsert({
      where: { name: 'System Failure' },
      update: {},
      create: { name: 'System Failure' },
    }),
    prisma.emergencyOption.upsert({
      where: { name: 'Data Loss' },
      update: {},
      create: { name: 'Data Loss' },
    }),
    prisma.emergencyOption.upsert({
      where: { name: 'Compliance Requirement' },
      update: {},
      create: { name: 'Compliance Requirement' },
    }),
  ]);
  console.log(`Created ${emergencyOptions.length} emergency options`);

  // Define Sections map for easier assignment
  const SECTIONS = [
    { name: 'Backend Team', branchName: 'Development', centerName: 'IT Center' },
    { name: 'Frontend Team', branchName: 'Development', centerName: 'IT Center' },
    { name: 'Cloud Team', branchName: 'Infrastructure', centerName: 'IT Center' },
    { name: 'Warehouse', branchName: 'Logistics', centerName: 'Operations Center' },
    { name: 'Payroll', branchName: 'Accounting', centerName: 'Finance Center' },
  ];

  const projectList = [
    { name: 'Cloud Migration', purpose: 'Migrate legacy apps to cloud', relatedTo: 'Cloud Platform', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H1, priority: Priority.P1, sectionId: 2 }, // Cloud Team
    { name: 'Database Upgrade', purpose: 'Upgrade PostgreSQL clusters', relatedTo: 'DB Management', type: ProjectType.Emergency, kind: 'Track', year: undefined, median: undefined, priority: Priority.P1, sectionId: 0, emergencyOption: 'System Failure' }, // Backend Team
    { name: 'New API Platform', purpose: 'Build new API gateway', relatedTo: 'API Gateway', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2, priority: Priority.P2, sectionId: 0 }, // Backend Team
    { name: 'DR Setup', purpose: 'Setup disaster recovery site', relatedTo: undefined, type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1, priority: Priority.P1, sectionId: 2 }, // Cloud Team
    { name: 'Dev Environment', purpose: 'New development environment', relatedTo: 'DevOps', type: ProjectType.Emergency, kind: 'App', year: undefined, median: undefined, priority: Priority.P1, sectionId: 2, emergencyOption: 'System Failure' }, // Cloud Team
    { name: 'Legacy Decom', purpose: 'Decommission old servers', relatedTo: undefined, type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1, priority: Priority.P3, sectionId: 2 }, // Cloud Team
    { name: 'AI Research', purpose: 'AI model training infrastructure', relatedTo: 'ML Pipeline', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2, priority: Priority.P2, sectionId: 0 }, // Backend Team
    { name: 'Network Refresh', purpose: 'Upgrade core switches', relatedTo: 'Network Infra', type: ProjectType.Emergency, kind: 'Track', year: 2026, median: Median.H1, priority: Priority.P1, sectionId: 2, emergencyOption: 'Security Breach' }, // Cloud Team (approx)
    { name: 'Storage Expansion', purpose: 'Add more storage capacity', relatedTo: undefined, type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H2, priority: Priority.P2, sectionId: 2 }, // Cloud Team
    { name: 'Kubernetes Upgrade', purpose: 'Upgrade K8s clusters', relatedTo: 'K8s Platform', type: ProjectType.Emergency, kind: 'Track', year: 2026, median: Median.H1, priority: Priority.P1, sectionId: 2, emergencyOption: 'Compliance Requirement' }, // Cloud Team
    { name: 'Security Audit', purpose: 'Infrastructure for security audit', relatedTo: 'Security Suite', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2, priority: Priority.P2, sectionId: 0 }, // Backend Team
    { name: 'Big Data Platform', purpose: 'Hadoop cluster setup', relatedTo: 'Big Data', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H1, priority: Priority.P2, sectionId: 0 }, // Backend Team
    { name: 'CRM Integration', purpose: 'Integrate new CRM system', relatedTo: 'CRM System', type: ProjectType.Emergency, kind: 'App', year: 2026, median: Median.H2, priority: Priority.P1, sectionId: 1, emergencyOption: 'Data Loss' }, // Frontend Team
    { name: 'ERP Migration', purpose: 'Migrate ERP to cloud', relatedTo: undefined, type: ProjectType.Semiannual, kind: 'Track', year: 2026, median: Median.H1, priority: Priority.P1, sectionId: 4 }, // Payroll (Finance)
    { name: 'Mobile App Backend', purpose: 'Backend for new mobile app', relatedTo: 'Mobile App', type: ProjectType.Semiannual, kind: 'App', year: 2026, median: Median.H2, priority: Priority.P2, sectionId: 0 }, // Backend Team
  ];

  const projects = await Promise.all(
    projectList.map((p, index) => {
      const creator = creators[index % creators.length];
      const location = locations[index % locations.length];
      const section = SECTIONS[p.sectionId || 0];

      return prisma.project.upsert({
        where: { name: p.name },
        update: {},
        create: {
          name: p.name,
          purpose: p.purpose,
          relatedTo: p.relatedTo,
          type: p.type,
          kindName: p.kind,
          locationId: location.id,
          year: p.year,
          median: p.median,
          priority: p.priority,
          centerName: section.centerName,
          branchName: section.branchName,
          sectionName: section.name,
          emergencyOptionName: p.type === ProjectType.Emergency ? (p as any).emergencyOption : undefined,
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
          centerName: project.centerName,
          branchName: project.branchName,
          sectionName: project.sectionName,
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

  // ============================================
  // Demand Comments
  // ============================================

  // Clear existing comments
  await prisma.demandComment.deleteMany({});

  // Add comments to some demands to simulate discussions
  const commentsData = [
    // Discussion on first demand
    { demandIndex: 0, user: USERS.user1, content: 'I need this urgently for the upcoming release.' },
    { demandIndex: 0, user: USERS.mod1, content: 'Can you provide more details about the expected workload?' },
    { demandIndex: 0, user: USERS.user1, content: 'We expect around 1000 concurrent users during peak hours.' },
    { demandIndex: 0, user: USERS.mod1, content: 'Thanks for clarifying. I will review and get back to you.' },

    // Discussion on second demand
    { demandIndex: 1, user: USERS.user2, content: 'This is for our new analytics pipeline.' },
    { demandIndex: 1, user: USERS.mod2, content: 'The requested amount seems high. Can you reduce it by 20%?' },
    { demandIndex: 1, user: USERS.user2, content: 'We can work with 80% but it will limit our growth capacity.' },

    // Discussion on third demand
    { demandIndex: 2, user: USERS.mod3, content: 'Please provide justification for this request.' },
    { demandIndex: 2, user: USERS.user3, content: 'This is needed for the database migration project scheduled for Q2.' },

    // Simple comment on fourth demand
    { demandIndex: 3, user: USERS.user1, content: 'This is aligned with our approved budget for this quarter.' },

    // Moderator feedback on fifth demand
    { demandIndex: 4, user: USERS.mod4, content: 'Approved pending security review.' },

    // Discussion on sixth demand
    { demandIndex: 5, user: USERS.user2, content: 'We need additional storage for backup purposes.' },
    { demandIndex: 5, user: USERS.mod5, content: 'Have you considered using the archival tier instead?' },
    { demandIndex: 5, user: USERS.user2, content: 'Good point, I will update the request.' },

    // Quick approval note
    { demandIndex: 6, user: USERS.mod6, content: 'This looks good. Forwarding for final approval.' },

    // Multi-party discussion
    { demandIndex: 7, user: USERS.user3, content: 'Critical for production stability.' },
    { demandIndex: 7, user: USERS.mod1, content: 'Can you share the incident report that triggered this?' },
    { demandIndex: 7, user: USERS.user3, content: 'Incident #INC-2024-001 - attached to the project documentation.' },
    { demandIndex: 7, user: USERS.mod1, content: 'Reviewed. This is approved as emergency request.' },
  ];

  const comments = await Promise.all(
    commentsData.map((c, index) =>
      prisma.demandComment.create({
        data: {
          demandId: demands[c.demandIndex].id,
          content: c.content,
          createdBy: c.user.username,
          createdByName: c.user.name,
          createdAt: new Date(Date.now() - (commentsData.length - index) * 3600000), // Stagger timestamps
        },
      })
    )
  );
  console.log(`Created ${comments.length} demand comments`);

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
