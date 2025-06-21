
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAssetForm } from './useAssetForm';
import { useAssetOperations } from './useAssetOperations';
import { useAssetCalculations } from './useAssetCalculations';

export const useLiquidAssetManagement = () => {
  const { data, updateLiquidAsset } = useFinancialData();
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingAsset,
    assetType,
    setAssetType,
    formData,
    setFormData,
    resetForm,
    handleStockSelection,
    handleEdit
  } = useAssetForm();
  
  const { handleSubmit: submitAsset, handleDelete } = useAssetOperations();
  const { calculateCryptoValue } = useAssetCalculations();

  const handleSubmit = async () => {
    const success = await submitAsset(assetType, formData, editingAsset);
    if (success) {
      setIsDialogOpen(false);
      resetForm();
    }
  };

  return {
    data,
    isDialogOpen,
    setIsDialogOpen,
    editingAsset,
    assetType,
    setAssetType,
    formData,
    setFormData,
    resetForm,
    handleStockSelection,
    handleSubmit,
    handleEdit,
    handleDelete,
    updateLiquidAsset,
    calculateCryptoValue
  };
};
