import React, { createContext, useState, useContext, ReactNode } from "react";

type FilterState = {
  category_id: string | null;
  subcategory_id: string | null;
  min_price: number | null;
  max_price: number | null;
  sort: string | null;
};

type FilterContextType = {
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
};

const defaultState: FilterState = {
  category_id: null,
  subcategory_id: null,
  min_price: null,
  max_price: null,
  sort: null,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilterState] = useState<FilterState>(defaultState);

  const setFilter = (newFilter: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  };

  const resetFilter = () => {
    setFilterState(defaultState);
  };

  return (
    <FilterContext.Provider value={{ filter, setFilter, resetFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
