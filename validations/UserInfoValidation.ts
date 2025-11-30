import * as Yup from "yup";

export const userInfoValidationSchema = Yup.object().shape({
    address: Yup.object().shape({
      address: Yup.string().required("آدرس الزامی است."),
      city: Yup.string().required("شهر الزامی است."),
      provider: Yup.string().required("استان الزامی است."),
      plaque: Yup.string().required("پلاک الزامی است."),
      unit: Yup.string().required("واحد الزامی است."),
      postalCode: Yup.string()
        .matches(/^\d{10}$/, "کد پستی باید 10 رقم باشد")
        .required("کد پستی الزامی است."),
    }),
    firstName: Yup.string().required("نام الزامی است."),
    lastName: Yup.string().required("نام خانوادگی الزامی است."),
    phone: Yup.string()
      .matches(/^09\d{9}$/, "شماره تماس باید 11 رقم باشد و با 09 شروع شود")
      .required("شماره تماس الزامی است."),
  });
  