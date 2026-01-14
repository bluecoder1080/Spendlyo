"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar" // Removed unused
  
  export function RecentTransactions() {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            You made 265 transactions this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                 NF
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Netflix Subscription</p>
                <p className="text-sm text-muted-foreground">
                  Entertainment
                </p>
              </div>
              <div className="ml-auto font-medium text-red-500">-₹649.00</div>
            </div>
            <div className="flex items-center">
               <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                 UP
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Uber Ride</p>
                <p className="text-sm text-muted-foreground">Travel</p>
              </div>
              <div className="ml-auto font-medium text-red-500">-₹450.00</div>
            </div>
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-xs">
                 SL
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Salary Credit</p>
                <p className="text-sm text-muted-foreground">Income</p>
              </div>
              <div className="ml-auto font-medium text-green-500">+₹1,20,000.00</div>
            </div>
             <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                 AM
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Amazon Purchase</p>
                <p className="text-sm text-muted-foreground">Shopping</p>
              </div>
              <div className="ml-auto font-medium text-red-500">-₹2,100.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
