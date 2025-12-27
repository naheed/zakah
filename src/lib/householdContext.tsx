import { createContext, useContext, ReactNode } from "react";

interface HouseholdContextValue {
  isHousehold: boolean;
}

const HouseholdContext = createContext<HouseholdContextValue>({ isHousehold: false });

export function HouseholdProvider({ 
  isHousehold, 
  children 
}: { 
  isHousehold: boolean; 
  children: ReactNode 
}) {
  return (
    <HouseholdContext.Provider value={{ isHousehold }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}

// Helper function to get household-aware description text
export function getHouseholdDescription(
  baseDescription: string,
  householdDescription: string,
  isHousehold: boolean
): string {
  return isHousehold ? householdDescription : baseDescription;
}
