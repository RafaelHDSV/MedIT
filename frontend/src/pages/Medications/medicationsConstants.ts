import { TagStatuses } from '@/components/Tag/Tag'
import { MedicationAvailabilityStatus } from '@/interfaces/IMedication'

export const MEDICATIONS_STATUS_MAP: Record<
  MedicationAvailabilityStatus,
  TagStatuses
> = {
  [MedicationAvailabilityStatus.AVAILABLE]: TagStatuses.SUCCESS,
  [MedicationAvailabilityStatus.LOW_STOCK]: TagStatuses.WARNING,
  [MedicationAvailabilityStatus.UNAVAILABLE]: TagStatuses.ERROR
}
