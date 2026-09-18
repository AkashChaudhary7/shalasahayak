import React from 'react';
import { DynamicModuleSeo, DynamicModuleSeoProps } from './DynamicModuleSeo';

export const SeoManager: React.FC<DynamicModuleSeoProps> = (props) => {
  return <DynamicModuleSeo {...props} />;
};

