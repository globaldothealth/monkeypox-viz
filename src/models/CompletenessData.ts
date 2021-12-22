export interface CompletenessDataRow extends Record<string, number | string> {
    country: string;
    _id: number;
    'caseReference.additionalSources': number;
    'caseReference.sourceEntryId': number;
    'caseReference.sourceId': number;
    'caseReference.sourceUrl': number;
    'caseReference.uploadIds': number;
    'caseReference.verificationStatus': number;
    'demographics.ageRange.end': number;
    'demographics.ageRange.start': number;
    'demographics.ethnicity': number;
    'demographics.gender': number;
    'demographics.nationalities': number;
    'demographics.occupation': number;
    'events.confirmed.date': number;
    'events.confirmed.value': number;
    'events.firstClinicalConsultation.date': number;
    'events.hospitalAdmission.date': number;
    'events.hospitalAdmission.value': number;
    'events.icuAdmission.date': number;
    'events.icuAdmission.value': number;
    'events.onsetSymptoms.date': number;
    'events.outcome.date': number;
    'events.outcome.value': number;
    'events.selfIsolation.date': number;
    genomeSequences: number;
    'genomeSequences.repositoryUrl': number;
    'genomeSequences.sampleCollectionDate': number;
    'genomeSequences.sequenceId': number;
    'genomeSequences.sequenceLength': number;
    'genomeSequences.sequenceName': number;
    'location.administrativeAreaLevel1': number;
    'location.administrativeAreaLevel2': number;
    'location.administrativeAreaLevel3': number;
    'location.country': number;
    'location.geoResolution': number;
    'location.geometry.latitude': number;
    'location.geometry.longitude': number;
    'location.name': number;
    'location.place': number;
    notes: number;
    pathogens: number;
    'preexistingConditions.hasPreexistingConditions': number;
    'preexistingConditions.values': number;
    'revisionMetadata.creationMetadata.date': number;
    'revisionMetadata.creationMetadata.notes': number;
    'revisionMetadata.editMetadata.date': number;
    'revisionMetadata.editMetadata.notes': number;
    'revisionMetadata.revisionNumber': number;
    'symptoms.status': number;
    'symptoms.values': number;
    'transmission.linkedCaseIds': number;
    'transmission.places': number;
    'transmission.routes': number;
    'travelHistory.travel.dateRange.end': number;
    'travelHistory.travel.dateRange.start': number;
    'travelHistory.travel.location.administrativeAreaLevel1': number;
    'travelHistory.travel.location.administrativeAreaLevel2': number;
    'travelHistory.travel.location.administrativeAreaLevel3': number;
    'travelHistory.travel.location.country': number;
    'travelHistory.travel.location.geoResolution': number;
    'travelHistory.travel.location.geometry.coordinates': number;
    'travelHistory.travel.location.name': number;
    'travelHistory.travel.location.place': number;
    'travelHistory.travel.methods': number;
    'travelHistory.travel.purpose': number;
    'travelHistory.traveledPrior30Days': number;
    'vaccines.number;.batch': number;
    'vaccines.number;.date': number;
    'vaccines.number;.name': number;
    'vaccines.number;.sideEffects': number;
    'vaccines.1.batch': number;
    'vaccines.1.date': number;
    'vaccines.1.name': number;
    'vaccines.1.sideEffects': number;
    'vaccines.2.batch': number;
    'vaccines.2.date': number;
    'vaccines.2.name': number;
    'vaccines.2.sideEffects': number;
    'vaccines.3.batch': number;
    'vaccines.3.date': number;
    'vaccines.3.name': number;
    'vaccines.3.sideEffects': number;
    variantOfConcern: number;
}
