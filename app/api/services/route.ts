import { NextResponse } from 'next/server'

export interface MockService {
  id: string
  name: string
  api_service_id: string
  api_price: number
  sell_price: number
  delivery_time: string
  category: string
  description: string
}

const MOCK_SERVICES: MockService[] = [
  {
    id: 'svc_001',
    name: 'Basic Device Info',
    api_service_id: 'api_basic_info',
    api_price: 0.5,
    sell_price: 0.99,
    delivery_time: 'Instant',
    category: 'Info',
    description: 'Get basic device information including model, brand, and manufacture date.',
  },
  {
    id: 'svc_002',
    name: 'Full Device Report',
    api_service_id: 'api_full_report',
    api_price: 1.5,
    sell_price: 2.99,
    delivery_time: '1–5 minutes',
    category: 'Info',
    description: 'Comprehensive device report with detailed hardware specifications and history.',
  },
  {
    id: 'svc_003',
    name: 'Blacklist Status Check',
    api_service_id: 'api_blacklist',
    api_price: 0.8,
    sell_price: 1.49,
    delivery_time: 'Instant',
    category: 'Blacklist',
    description: 'Check if the device has been reported lost, stolen, or blocked on any network.',
  },
  {
    id: 'svc_004',
    name: 'USA Blacklist Check',
    api_service_id: 'api_blacklist_usa',
    api_price: 1.0,
    sell_price: 1.99,
    delivery_time: 'Instant',
    category: 'Blacklist',
    description: 'Check GSMA and major US carrier blacklist databases (AT&T, Verizon, T-Mobile).',
  },
  {
    id: 'svc_005',
    name: 'Carrier Lock Status',
    api_service_id: 'api_carrier_lock',
    api_price: 0.9,
    sell_price: 1.79,
    delivery_time: '1–10 minutes',
    category: 'Carrier',
    description: 'Determine the original carrier and whether the device is network locked.',
  },
  {
    id: 'svc_006',
    name: 'SIM Lock & Network Check',
    api_service_id: 'api_sim_lock',
    api_price: 1.2,
    sell_price: 2.49,
    delivery_time: '1–5 minutes',
    category: 'Carrier',
    description: 'Full SIM lock status and network compatibility report.',
  },
  {
    id: 'svc_007',
    name: 'Apple Warranty Check',
    api_service_id: 'api_apple_warranty',
    api_price: 0.7,
    sell_price: 1.29,
    delivery_time: 'Instant',
    category: 'Warranty',
    description: 'Check Apple warranty status, coverage type, and expiry date for iPhone and iPad.',
  },
  {
    id: 'svc_008',
    name: 'Samsung Warranty Check',
    api_service_id: 'api_samsung_warranty',
    api_price: 0.7,
    sell_price: 1.29,
    delivery_time: 'Instant',
    category: 'Warranty',
    description: 'Verify Samsung warranty status and service eligibility.',
  },
  {
    id: 'svc_009',
    name: 'iPhone Unlock Status',
    api_service_id: 'api_iphone_unlock',
    api_price: 1.8,
    sell_price: 3.49,
    delivery_time: '1–24 hours',
    category: 'Unlock',
    description:
      'Full iPhone unlock eligibility report — check if your iPhone can be officially unlocked by Apple.',
  },
  {
    id: 'svc_010',
    name: 'GSX Full Apple Check',
    api_service_id: 'api_gsx_full',
    api_price: 2.5,
    sell_price: 4.99,
    delivery_time: '5–15 minutes',
    category: 'Unlock',
    description:
      'Apple GSX full report including activation status, Find My iPhone, purchase country, and more.',
  },
]

export async function GET() {
  return NextResponse.json(MOCK_SERVICES)
}
