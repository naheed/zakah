/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { BatchUploadDropzone } from "@/components/upload/BatchUploadDropzone";
import { StepHeader } from "../StepHeader";
import { UploadSimple } from "@phosphor-icons/react";
import { ZakatFormData } from "@/lib/zakatTypes";

interface UploadFirstStepProps {
    onNext: () => void;
}

export function UploadFirstStep({ onNext }: UploadFirstStepProps) {
    const { updateFormData } = useZakatPersistence();

    const handleUploadComplete = (data: Partial<ZakatFormData>) => {
        // 1. Determine which flags to enable based on populated data
        const updates: Partial<ZakatFormData> = { ...data };

        if (
            (data.goldInvestmentValue || 0) > 0 ||
            (data.goldJewelryValue || 0) > 0 ||
            (data.silverInvestmentValue || 0) > 0 ||
            (data.silverJewelryValue || 0) > 0
        ) {
            updates.hasPreciousMetals = true;
        }

        if (
            (data.cryptoCurrency || 0) > 0 ||
            (data.cryptoTrading || 0) > 0 ||
            (data.stakedAssets || 0) > 0
        ) {
            updates.hasCrypto = true;
        }

        if (
            (data.revocableTrustValue || 0) > 0 ||
            (data.irrevocableTrustValue || 0) > 0
        ) {
            updates.hasTrusts = true;
        }

        if (
            (data.realEstateForSale || 0) > 0 ||
            (data.rentalPropertyIncome || 0) > 0
        ) {
            updates.hasRealEstate = true;
        }

        if (
            (data.businessCashAndReceivables || 0) > 0 ||
            (data.businessInventory || 0) > 0
        ) {
            updates.hasBusiness = true;
        }

        if (
            (data.illiquidAssetsValue || 0) > 0 ||
            (data.livestockValue || 0) > 0
        ) {
            updates.hasIlliquidAssets = true;
        }

        if (
            (data.goodDebtOwedToYou || 0) > 0 ||
            (data.badDebtRecovered || 0) > 0
        ) {
            updates.hasDebtOwedToYou = true;
        }

        if (
            (data.propertyTax || 0) > 0 ||
            (data.lateTaxPayments || 0) > 0
        ) {
            updates.hasTaxPayments = true;
        }

        // 2. Update Form Data
        updateFormData(updates);

        // 3. Move to next step (Category Selection for review)
        onNext();
    };

    return (
        <div className="space-y-8">
            <StepHeader
                title="Upload Financial Documents"
                emoji={<UploadSimple className="w-8 h-8 text-primary" weight="duotone" />}
            />

            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <BatchUploadDropzone onUploadComplete={handleUploadComplete} />
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Supported formats: PDF, JPG, PNG. <br />
                Your data is processed securely and not stored permanently.
            </p>
        </div>
    );
}
