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

import { ZakatWizard } from "@/components/zakat/ZakatWizard";
import { Helmet } from "react-helmet-async";
import { getPrimaryUrl } from "@/lib/domainConfig";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ZakatFlow - Islamic Zakat Calculator for Modern Finance</title>
        <meta 
          name="description" 
          content="Calculate your Zakat with our comprehensive calculator based on authentic Islamic scholarship. Covers stocks, crypto, retirement accounts, and more." 
        />
        <meta name="keywords" content="zakat calculator, zakah, islamic finance, nisab, muslim finance, 401k zakat, crypto zakat" />
        <link rel="canonical" href={getPrimaryUrl('/')} />
        <meta property="og:url" content={getPrimaryUrl('/')} />
      </Helmet>
      <ZakatWizard />
    </>
  );
};

export default Index;
