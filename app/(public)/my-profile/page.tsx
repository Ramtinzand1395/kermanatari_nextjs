"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Stepper from "./Stepper";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Profile from "./Profile";
import UserOrders from "./UserOrders";
import FavoritesPage from "./Favorites";
import MyAddresses from "./MyAddresses";
import MyComments from "./MyComments";
import MyOrders from "./MyOrders";

export default function MyProfile() {
  const searchParams = useSearchParams();
  const activeStep = Number(searchParams.get("step") ?? 1);

  const { data: session } = useSession();

  return (
    <div className="md:container mx-auto sm:mx-2 my-5">
      <div className="flex gap-5">
        <Sidebar session={session} />

        <div className="flex flex-col w-full md:w-[70vw]">
          <Stepper activeStep={activeStep} />

          {activeStep === 1 && <Profile />}
          {activeStep === 2 && <FavoritesPage />}
          {activeStep === 3 && <MyAddresses />}
          {activeStep === 4 && <MyComments />}
          {activeStep === 5 && <MyOrders />}
        </div>
      </div>
    </div>
  );
}
