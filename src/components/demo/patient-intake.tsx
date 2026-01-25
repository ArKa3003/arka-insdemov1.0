"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  User, 
  CreditCard, 
  FileText, 
  Building2,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Pill,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";
import { patients, imagingOrders } from "@/lib/mock-data";
import type { Patient, MedicalHistoryItem } from "@/types";

// ============================================================================
// TYPES
// ============================================================================

interface PatientIntakeProps {
  onContinue?: () => void;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getAvatarColor = (id: string): string => {
  const colors = [
    "bg-arka-blue",
    "bg-arka-teal",
    "bg-arka-green",
    "bg-purple-500",
    "bg-orange-500",
  ];
  const index = id.charCodeAt(id.length - 1) % colors.length;
  return colors[index];
};

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const isComplexCase = (patient: Patient): boolean => {
  // Complex if has 3+ active conditions or specific high-risk diagnoses
  const activeConditions = patient.medicalHistory.filter(
    (h) => h.status === "active" || h.status === "chronic"
  );
  return activeConditions.length >= 3;
};

const getPrimaryDiagnosis = (patient: Patient): MedicalHistoryItem | null => {
  return patient.medicalHistory.find((h) => h.status === "active") || 
         patient.medicalHistory[0] || null;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isSelected,
  onSelect,
  index,
}) => {
  const age = calculateAge(patient.dateOfBirth);
  const isComplex = isComplexCase(patient);
  const primaryDiagnosis = getPrimaryDiagnosis(patient);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        variant={isSelected ? "elevated" : "default"}
        className={cn(
          "relative cursor-pointer transition-all duration-300",
          isSelected 
            ? "border-2 border-arka-blue ring-2 ring-arka-blue/20" 
            : "hover:border-slate-300 hover:shadow-md"
        )}
        onClick={onSelect}
      >
        {/* Selected checkmark */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 z-10"
            >
              <div className="h-6 w-6 rounded-full bg-arka-blue flex items-center justify-center shadow-lg">
                <Check className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complex case indicator */}
        {isComplex && (
          <div className="absolute top-3 right-3">
            <Badge status="warning" variant="subtle" size="sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Complex
            </Badge>
          </div>
        )}

        <CardContent className="p-5">
          {/* Patient header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div
              className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
                getAvatarColor(patient.id)
              )}
            >
              {getInitials(patient.firstName, patient.lastName)}
            </div>

            {/* Name and demographics */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-arka-navy truncate">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-slate-500">
                {age} years old • {patient.gender === "male" ? "Male" : "Female"}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <CreditCard className="h-3 w-3" />
                <span className="font-mono">{patient.memberId}</span>
              </div>
            </div>
          </div>

          {/* Insurance info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-700">{patient.insurancePlan.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                status={patient.insurancePlan.priorAuthRequired ? "info" : "success"} 
                variant="subtle" 
                size="sm"
              >
                {patient.insurancePlan.rbmVendor}
              </Badge>
              {patient.insurancePlan.priorAuthRequired && (
                <span className="text-xs text-arka-amber font-medium">PA Required</span>
              )}
            </div>
          </div>

          {/* Primary diagnosis */}
          {primaryDiagnosis && (
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">Primary Diagnosis</p>
              <p className="text-sm font-medium text-slate-700">{primaryDiagnosis.condition}</p>
              <p className="text-xs text-slate-400 font-mono">{primaryDiagnosis.icdCode}</p>
            </div>
          )}

          {/* Select button */}
          <Button
            variant={isSelected ? "success" : "secondary"}
            size="sm"
            fullWidth
            className="mt-2"
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              "Select Patient"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface PatientDetailsProps {
  patient: Patient;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  const age = calculateAge(patient.dateOfBirth);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <Card variant="default" className="mt-6">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-arka-blue" />
            Patient Details: {patient.firstName} {patient.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Medical History */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="h-4 w-4 text-arka-teal" />
                <h4 className="font-semibold text-sm text-slate-700">Medical History</h4>
              </div>
              <ul className="space-y-2">
                {patient.medicalHistory.map((item) => (
                  <li key={item.id} className="text-sm">
                    <div className="flex items-start gap-2">
                      <Badge
                        status={
                          item.status === "active" ? "warning" :
                          item.status === "chronic" ? "info" : "success"
                        }
                        variant="subtle"
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-slate-700 mt-1">{item.condition}</p>
                    <p className="text-xs text-slate-400 font-mono">{item.icdCode}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Previous Imaging */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-arka-blue" />
                <h4 className="font-semibold text-sm text-slate-700">Previous Imaging</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {patient.medicalHistory.some(h => h.notes?.includes("imaging")) ? (
                  patient.medicalHistory
                    .filter(h => h.notes?.includes("imaging"))
                    .map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        {item.notes}
                      </li>
                    ))
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Lumbar X-ray (2023-06)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      CT if applicable
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Current Medications */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="h-4 w-4 text-arka-green" />
                <h4 className="font-semibold text-sm text-slate-700">Current Medications</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-arka-green" />
                  Meloxicam 15mg daily
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-arka-green" />
                  Gabapentin 300mg TID
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-arka-green" />
                  Omeprazole 20mg daily
                </li>
              </ul>
            </div>

            {/* Insurance Details */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-arka-amber" />
                <h4 className="font-semibold text-sm text-slate-700">Insurance & PA</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Plan</p>
                  <p className="text-slate-700 font-medium">{patient.insurancePlan.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Plan Type</p>
                  <p className="text-slate-700">{patient.insurancePlan.type}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">RBM Vendor</p>
                  <Badge status="info" variant="outline" size="sm">
                    {patient.insurancePlan.rbmVendor}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Prior Auth</p>
                  <Badge 
                    status={patient.insurancePlan.priorAuthRequired ? "warning" : "success"} 
                    variant="subtle" 
                    size="sm"
                  >
                    {patient.insurancePlan.priorAuthRequired ? "Required" : "Not Required"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Demographics row */}
          <div className="border-t border-slate-100 p-5 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Date of Birth</p>
                <p className="text-slate-700 font-medium">
                  {new Date(patient.dateOfBirth).toLocaleDateString()} ({age} y/o)
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Gender</p>
                <p className="text-slate-700 font-medium capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Member ID</p>
                <p className="text-slate-700 font-mono">{patient.memberId}</p>
              </div>
              {patient.contactInfo?.phone && (
                <div>
                  <p className="text-slate-500 text-xs">Phone</p>
                  <p className="text-slate-700">{patient.contactInfo.phone}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PatientIntake({ onContinue, className }: PatientIntakeProps) {
  const { 
    selectedPatientId, 
    selectedPatient,
    setSelectedPatient,
    setCurrentOrder,
    completeStep,
    nextStep,
  } = useDemoStore();

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatient(patientId);
    const orderForPatient = imagingOrders.find((o) => o.patientId === patientId);
    setCurrentOrder(orderForPatient?.id ?? null);
  };

  const handleContinue = () => {
    if (selectedPatientId) {
      completeStep(1);
      nextStep();
      onContinue?.();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">
            Step 1
          </Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Patient Identification
          </h2>
        </div>
        <p className="text-slate-600">
          Select a patient to begin the prior authorization process
        </p>
      </motion.div>

      {/* Patient cards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient, index) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            isSelected={selectedPatientId === patient.id}
            onSelect={() => handleSelectPatient(patient.id)}
            index={index}
          />
        ))}
      </div>

      {/* Selected patient details */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientDetails patient={selectedPatient} />
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {selectedPatientId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-end pt-4"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(0, 82, 204, 0)",
                  "0 0 0 8px rgba(0, 82, 204, 0.1)",
                  "0 0 0 0 rgba(0, 82, 204, 0)",
                ],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-lg"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                rightIcon={<ChevronRight className="h-5 w-5" />}
              >
                Continue to Order Entry
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PatientIntake;
