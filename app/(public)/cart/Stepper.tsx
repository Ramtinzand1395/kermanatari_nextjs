interface StepperCartProps {
  activeStep: number;
}
export default function StepperCart({ activeStep }: StepperCartProps) {
  const steps = [
    { id: 1, title: "سبد خرید" },
    { id: 2, title: "آدرس" },
    { id: 3, title: "پرداخت" },
  ];
  return (
    <div className="flex items-start gap-8 lg:gap-16">
      {steps.map((step) => (
        <div
          className={`flex items-center gap-2 border-b-2 pb-4 ${
            step.id === activeStep ? "border-[#377dff]" : "border-gray-200"
          }`}
          key={step.id}
        >
          <div
            className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
              step.id === activeStep ? "bg-[#377dff]" : "bg-gray-400"
            }`}
          >
            {step.id}
          </div>
          <p
            className={`text-sm font-medium ${
              step.id === activeStep ? "text-[#377dff]" : "text-gray-400"
            }`}
          >
            {step.title}
          </p>
        </div>
      ))}
    </div>
  );
}
