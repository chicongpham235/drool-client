import PageContainer from "@/layout/PageContainer";
import React from "react";
import { FiTarget } from "react-icons/fi";

const TargetPage: React.FC = () => {
  return (
    <PageContainer icon={<FiTarget />} title="Khai báo chỉ tiêu">
      <div>
        {/* Content for TargetPage goes here */}
        <p>Chức năng này đang được phát triển.</p>
      </div>
    </PageContainer>
  );
};

export default TargetPage;
