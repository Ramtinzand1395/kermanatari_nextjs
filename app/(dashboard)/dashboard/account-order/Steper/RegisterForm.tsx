"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import Stepper from "./Stepper";
import StepperControll from "./StepperControll";
import Search from "./steps/Search";
import AddUserForm from "./steps/AddUserForm";
import AddOrderForm from "./steps/AddOrderForm";

import { orderSchema } from "@/validations/CustomerAppValidation";
import { Customer, CustomerOrder } from "@/types";

interface AddOrderModalProps {
  closeModal: () => void;
}

const RegisterForm = ({ closeModal }: AddOrderModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingAddCustomer, setLoadingAddCustomer] = useState(false);
  const steps = ["جستجو", "ثبت فرد", "ثبت سفارش"];

  const [customerData, setCustomerData] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    lastName: "",
    createdAt: "",
    updatedAt: "",
    persianDate: "",
    sex: "",
    birthday: "",
    description: "",
    CustomerOrder: [],
  });

  const [Order, setOrder] = useState<CustomerOrder>({
    id: 0,
    list: [],
    price: 0,
    customer: {
      id: 0,
      name: "",
      mobile: "",
      lastName: "",
      createdAt: "",
      updatedAt: "",
      persianDate: "",
      sex: "",
      birthday: "",
      description: "",
      CustomerOrder: [],
    },
    customerId: 0,
    description: "",
    consoleType: "",
    deliveryStatus: "",
    createdAt: "",
    updatedAt: "",
    persianDate: "",
    deliveryCode: "",
    deliveryDate: "",
  });

  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Search
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
        );
      case 2:
        return (
          <AddUserForm
            loadingName={loadingName}
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
        );
      case 3:
        return (
          <AddOrderForm
            handleSubmite={handleSubmit}
            Order={Order}
            setOrder={setOrder}
            loadingAddCustomer={loadingAddCustomer}
          />
        );
      default:
        return null;
    }
  };

  const handleClick = (direction?: string) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    if (newStep > 0 && newStep <= steps.length) setCurrentStep(newStep);
  };

  // ✅ API جدید - جستجوی مشتری
  const handleSearch = async () => {
    setLoadingName(true);
    if (!customerData.mobile) {
      toast.warning("لطفا شماره تلفن را وارد کنید");
      setLoadingName(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/customer?mobile=${customerData.mobile}`
      );
      const data = await res.json();

      if (res.status === 200) {
        setCustomerData(data.data);
        toast.info(`شماره تلفن ${customerData.mobile} موجود است.`);
      } else if (res.status === 404) {
        setCustomerData({
          id: 0,
          name: "",
          mobile: customerData.mobile,
          lastName: "",
          createdAt: "",
          updatedAt: "",
          persianDate: "",
          sex: "",
          birthday: "",
          description: "",
          CustomerOrder: [],
        });
        toast.warning(`اطلاعات ${customerData.mobile} را وارد کنید.`);
      }
    } catch (err) {
      console.error("خطای سرور:", err);
      toast.error("خطای سرور رخ داده است.");
    } finally {
      setLoadingName(false);
    }
  };

  // ✅ API جدید - اضافه کردن مشتری
  const handleAddCustomer = async () => {
    if (!customerData.lastName) {
      toast.warning("لطفا نام خانوادگی را وارد کنید");
      return;
    }
    setLoadingAddCustomer(true);
    try {
      const res = await fetch("/api/admin/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      const data = await res.json();
      console.log(data, "customer");
      if (res.status === 201) {
        setCustomerData((prev) => ({ ...prev, id: data.data.id }));
      }
      toast.info(data.message);
    } catch (err) {
      console.error(err);
      toast.error("خطای سرور رخ داده است.");
    } finally {
      setLoadingAddCustomer(false);
    }
  };

  // ✅ API جدید - اضافه کردن سفارش
  const handleSubmit = async () => {
    setLoadingAddCustomer(true);
    console.log(customerData);
    try {
      await orderSchema.validate(Order, { abortEarly: false });

      const payload = { ...Order, customerId: customerData.id };
      const res = await fetch("/api/admin/customer-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 201) {
        toast.success(data.message);
        // setOrders((prev) => [
        //   ...prev,
        //   { ...data.Data, list: JSON.parse(data.data.list) },
        // ]);
        closeModal();
      } else {
        toast.error(data.message || "خطا در ثبت سفارش");
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => e.message && toast.error(e.message));
      } else {
        toast.error("خطای نامشخصی رخ داده است");
      }
    } finally {
      setLoadingAddCustomer(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="my-10 p-10">{displayStep(currentStep)}</div>
      </div>
      {currentStep !== steps.length + 1 && (
        <StepperControll
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          handleSearch={handleSearch}
          handleAddCustomer={handleAddCustomer}
          customerData={customerData}
        />
      )}
    </>
  );
};

export default RegisterForm;
