import { ZakatWizard } from "@/components/zakat/ZakatWizard";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Zakah Flow - Islamic Zakat Calculator for Modern Finance</title>
        <meta 
          name="description" 
          content="Calculate your Zakat with our comprehensive calculator based on authentic Islamic scholarship. Covers stocks, crypto, retirement accounts, and more." 
        />
        <meta name="keywords" content="zakat calculator, zakah, islamic finance, nisab, muslim finance, 401k zakat, crypto zakat" />
      </Helmet>
      <ZakatWizard />
    </>
  );
};

export default Index;
