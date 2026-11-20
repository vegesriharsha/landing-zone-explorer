// Data and rules for the Resilience page. Every rule below restates a statement on a
// Microsoft Learn page listed in `src`, checked 20 Nov 2026. Where a page is silent the
// outcome says so rather than guess.
export const VERIFIED_RESILIENCE = '20 Nov 2026';

export const regions = {
  primary: { name: 'East US 2', zones: 4 }, // regions-list: 4 availability zones
  secondary: { name: 'Central US', zones: 3 }, // regions-list: 3; the two are each other's pair
};

export const failures = [
  { id: 'zone', label: 'A zone goes down', detail: 'One availability zone in East US 2 is unavailable.' },
  { id: 'region', label: 'The region goes down', detail: 'All of East US 2 is unavailable.' },
  { id: 'data', label: 'Data is deleted or encrypted', detail: 'An accident or ransomware destroys the live data.' },
];

export const placements = [
  { id: 'zonal', label: 'One zone', detail: 'A zonal resource: you pick the zone.' },
  { id: 'zr', label: 'Zone-redundant', detail: 'The service spreads the workload across zones.' },
  { id: 'multi', label: 'Zone-redundant + second region', detail: 'Also replicated to Central US.' },
];

/**
 * What happens for one design and one failure.
 * state: up | down | manual | restore | lost (the page pairs each with a word, never colour alone).
 */
export function outcome({ placement, failure, backup, immutable }) {
  const locked = backup && immutable;
  if (failure === 'zone') {
    if (placement === 'zonal') {
      return {
        state: 'down',
        headline: 'Down until you fail over yourself',
        why: 'A zonal resource sits in the one zone you chose and does not survive an outage of that zone on its own. Microsoft does not manage the failover of zonal resources for you.',
        src: ['azZones'],
      };
    }
    return {
      state: 'up',
      headline: 'Keeps running',
      why: 'The service replicates or distributes a zone-redundant resource across zones, so one zone going down does not take it out.',
      src: ['azZones'],
    };
  }
  if (failure === 'region') {
    if (placement === 'multi') {
      return {
        state: 'manual',
        headline: 'Recovers in Central US when you run your failover',
        why: 'Region pairs do not give automatic failover or disaster recovery. Microsoft says not to rely on Microsoft-managed failover between a pair as your primary disaster recovery approach, so the plan, the runbook and the rehearsal are yours.',
        src: ['regionsPaired', 'cafBcdr'],
      };
    }
    return {
      state: 'down',
      headline: 'Down until the region returns',
      why: 'Availability zones do not protect against a full region outage. Without a second region there is nowhere to recover to.',
      src: ['azZones'],
    };
  }
  // failure === 'data'
  if (!backup) {
    return {
      state: 'lost',
      headline: 'No recovery point to restore from',
      why: 'Zones and a second region are for outages. Protecting data from deletion, corruption or ransomware is the job of backup, and this design has none.',
      src: ['backupOverview'],
    };
  }
  return {
    state: 'restore',
    headline: 'Restore from a recovery point',
    why: locked
      ? 'Azure Backup protects against accidental deletion, corruption and ransomware. A locked immutable vault blocks operations that could delete recovery points, and a lock cannot be undone.'
      : 'Azure Backup protects against accidental deletion, corruption and ransomware. Soft delete keeps deleted backup data for a defined period. An immutable vault would add a block on operations that could lose recovery points.',
    src: locked ? ['backupOverview', 'immutableVault'] : ['backupOverview'],
  };
}

export const stateInfo = {
  up: { word: 'Running', tone: 'good' },
  down: { word: 'Down', tone: 'bad' },
  manual: { word: 'Recovers on your failover', tone: 'gold' },
  restore: { word: 'Restorable', tone: 'good' },
  lost: { word: 'Not recoverable', tone: 'bad' },
};

// What the CAF page recommends for a landing zone, as listed on that page.
export const recommendations = [
  'Use Azure Site Recovery for Azure-to-Azure virtual machine disaster recovery.',
  'Use the native disaster recovery features of PaaS services.',
  'Use Azure-native backup, which removes the need for third-party backup software and infrastructure.',
  'Use multiple regions and peering locations for ExpressRoute connectivity.',
  'Avoid overlapping IP address ranges between production and disaster recovery networks.',
];
