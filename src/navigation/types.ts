export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AddMeal: undefined;
  AddGlucose: undefined;
  AddInsulin: undefined;
  HealthcareHome: undefined;
  PatientDetail: { patientId: string };
  AddPatient: undefined;
};

export type TabParamList = {
  Home: undefined;
  Statistics: undefined;
  Settings: undefined;
}; 