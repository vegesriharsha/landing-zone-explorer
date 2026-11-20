// Data and rules for the IP plan and private DNS page. Rules restate Microsoft Learn pages
// named by key in `src`, checked 20 Nov 2026. Names and ranges are fictional (Contoso Bank).
export const VERIFIED_IPDNS = '20 Nov 2026';

// T-shirt sizes from the CAF IP addressing page (cafIp): Small /24, Medium /22, Large /20.
export const sizes = [
  { id: 'S', label: 'Small /24', size: 256 },
  { id: 'M', label: 'Medium /22', size: 1024 },
  { id: 'L', label: 'Large /20', size: 4096 },
];

// An illustrative East US 2 plan: a /16 block for the region, with a hub and some spokes.
export const REGION_BLOCK = '10.20.0.0/16';
export const initialBlocks = [
  { id: 'hub', name: 'Hub (connectivity)', size: 'M', role: 'hub' },
  { id: 'payments', name: 'payments-prod spoke', size: 'M', role: 'spoke' },
  { id: 'portal', name: 'portal-prod spoke', size: 'S', role: 'spoke' },
  { id: 'mgmt', name: 'platform-management spoke', size: 'S', role: 'spoke' },
  { id: 'lab', name: 'lab-sandbox-01 spoke', size: 'S', role: 'spoke' },
];

// On-premises range Contoso's data centre already uses: it deliberately collides with the plan.
export const ON_PREM_DEFAULT = '10.20.0.0/20';

// What the pages say happens with overlapping space (vnetFaq, cafIp).
export const overlapFacts = [
  { text: 'You can’t enable virtual network peering if address spaces overlap.', src: ['vnetFaq'] },
  { text: 'You can link a virtual network to on-premises networks only as long as the CIDR blocks don’t overlap.', src: ['vnetFaq'] },
  { text: 'Azure VPN Gateway can connect overlapping on-premises sites using network address translation, generally available in Azure Virtual WAN and standalone VPN Gateway.', src: ['cafIp'] },
];

/**
 * Private endpoint name resolution for one client. The rule needs the private zone to answer,
 * and the zone only answers networks linked to it (privateDns); on-premises clients also need
 * a conditional forwarder to the resolver inbound endpoint (dnsResolver, cafDns).
 */
export function resolve({ client, linkedSpoke, linkedHub, forwarder }) {
  if (client === 'azure') {
    return linkedSpoke
      ? {
          ok: true,
          headline: 'Resolves to the private IP address',
          steps: ['The spoke VM asks Azure DNS for the storage account name.', 'The public record points to the privatelink name through a CNAME.', 'The spoke’s network is linked to the private DNS zone, so the zone answers with the private endpoint’s IP.'],
          src: ['peDns', 'privateDns'],
        }
      : {
          ok: false,
          headline: 'Does not resolve to the private IP address',
          steps: ['The spoke VM asks Azure DNS for the storage account name.', 'The public record points to the privatelink name through a CNAME.', 'The spoke’s network is not linked to the private DNS zone, so the zone cannot answer. The name does not resolve to the private endpoint’s IP.'],
          src: ['peDns', 'privateDns', 'peOverview'],
        };
  }
  if (!forwarder) {
    return {
      ok: false,
      headline: 'Does not resolve to the private IP address',
      steps: ['The on-premises server asks its own DNS server.', 'Nothing forwards the name to Azure, so Azure’s private zone is never asked.', 'The name does not resolve to the private endpoint’s IP.'],
      src: ['dnsResolver', 'cafDns', 'peOverview'],
    };
  }
  return linkedHub
    ? {
        ok: true,
        headline: 'Resolves to the private IP address',
        steps: ['The on-premises DNS server has a conditional forwarder to the resolver’s inbound endpoint in the hub.', 'The inbound endpoint takes the query into the hub network.', 'The hub’s network is linked to the private DNS zone, so the zone answers with the private endpoint’s IP.'],
        src: ['dnsResolver', 'cafDns', 'privateDns'],
      }
    : {
        ok: false,
        headline: 'Does not resolve to the private IP address',
        steps: ['The on-premises DNS server forwards to the resolver’s inbound endpoint in the hub.', 'The hub’s network is not linked to the private DNS zone, so the zone cannot answer.', 'The name does not resolve to the private endpoint’s IP.'],
        src: ['dnsResolver', 'privateDns'],
      };
}

export const ipRecommendations = [
  { text: 'Plan non-overlapping address spaces across Azure regions and on-premises in advance.', src: ['cafIp'] },
  { text: 'Use RFC 1918 private addresses, and don’t use public IP addresses for virtual networks.', src: ['cafIp', 'vnetFaq'] },
  { text: 'Don’t create large virtual networks like /16 just because you can; plan the space each one needs.', src: ['cafIp'] },
  { text: 'Azure reserves five addresses in every subnet, so count them when you size subnets.', src: ['cafIp', 'vnetFaq'] },
  { text: 'Use an IPAM approach with an API for reserving non-overlapping ranges, and remove ranges when you decommission a workload.', src: ['cafIp'] },
];

export const dnsRecommendations = [
  { text: 'Create the Azure Private DNS zones in a global connectivity subscription.', src: ['cafDns'] },
  { text: 'Link each private DNS zone to every virtual network that needs to resolve the private endpoint names.', src: ['peHubSpoke', 'privateDns'] },
  { text: 'Put two dedicated subnets for DNS Private Resolver in the hub, one inbound and one outbound, each at least /28.', src: ['cafDns'] },
  { text: 'Point on-premises conditional forwarders at the resolver’s inbound endpoint IP address.', src: ['cafDns', 'dnsResolver'] },
  { text: 'A virtual network can be linked to only one private DNS zone with auto-registration turned on.', src: ['cafDns', 'privateDns'] },
];
