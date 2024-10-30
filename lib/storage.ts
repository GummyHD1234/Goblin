"use client";

export const saveLogoToStorage = (logoData: string) => {
  try {
    localStorage.setItem('app_logo', logoData);
    return true;
  } catch (error) {
    console.error('Error saving logo:', error);
    return false;
  }
};

export const getLogoFromStorage = (): string | null => {
  try {
    return localStorage.getItem('app_logo');
  } catch (error) {
    console.error('Error loading logo:', error);
    return null;
  }
};