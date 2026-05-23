import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone,
  CheckCircle2,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { 
  format, 
  addDays, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  eachDayOfInterval,
  isBefore,
  startOfToday
} from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "../lib/utils";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\s\-+()]{7,20}$/, "Please enter a valid phone number"),
  businessName: z.string().optional(),
  monthlyTurnover: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "date" | "time" | "details" | "success";

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  }, []);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleBooking = async (data: BookingFormValues) => {
    setIsLoading(true);
    setSubmitError(null);
    
    try {
      try {
        await addDoc(collection(db, "leads"), {
          ...data,
          appointmentDate: format(selectedDate, "PPP"),
          appointmentTime: selectedTime,
          source: "consultation_booking",
          createdAt: serverTimestamp(),
        });
      } catch (dbError: any) {
        console.error("Firestore Client save failed:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          appointmentDate: format(selectedDate, "PPP"),
          appointmentTime: selectedTime,
          source: "consultation_booking",
        }),
      });

      if (response.ok) {
        setStep("success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      setSubmitError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep("date");
    setSelectedTime(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetModal}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
      >
        {/* Sidebar Info */}
        <div className="md:w-1/3 bg-navy p-8 text-white">
          <div className="mb-8">
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2 font-display">Service</p>
            <h3 className="text-lg font-bold">Free Payment Audit</h3>
            <p className="text-blue-100/60 text-xs mt-2">30-minute discovery call with a UK consultant.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-gold" />
              <span>30 Minutes</span>
            </div>
            {selectedDate && (
              <div className="flex items-start gap-3 text-sm animate-in fade-in slide-in-from-left-2">
                <CalendarIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gold">{format(selectedDate, "EEEE, MMMM do")}</p>
                  {selectedTime && <p className="text-blue-100/60">{selectedTime} (GMT)</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-gold" />
              </div>
              <p className="text-xs text-blue-100/60 leading-tight">Secure, independent consultancy.</p>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex-grow p-6 md:p-10 flex flex-col h-full overflow-y-auto max-h-[80vh] md:max-h-none">
          <button 
            onClick={resetModal}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {step === "date" && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold text-navy mb-6">Select a Date</h2>
              
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-navy">{format(currentMonth, "MMMM yyyy")}</h4>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);
                  const isPrevMonth = !isSameMonth(day, currentMonth);
                  const isPast = isBefore(day, startOfToday());
                  const isDisabled = isPast;

                  return (
                    <button
                      key={i}
                      disabled={isDisabled}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "h-12 flex flex-col items-center justify-center rounded-xl transition-all relative text-sm font-medium",
                        isPrevMonth && "text-gray-300",
                        isDisabled ? "cursor-not-allowed text-gray-200" : "hover:bg-blue-50 text-navy",
                        isSelected && "bg-navy text-white hover:bg-navy shadow-lg shadow-navy/20",
                        isToday && !isSelected && "text-gold font-bold underline"
                      )}
                    >
                      {format(day, "d")}
                      {isSelected && (
                        <motion.div layoutId="activeDay" className="absolute inset-0 border-2 border-gold rounded-xl pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setStep("time")}
                className="w-full bg-navy text-white font-bold py-4 rounded-xl mt-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Times
              </button>
            </div>
          )}

          {step === "time" && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <button onClick={() => setStep("date")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Change Date
              </button>
              <h2 className="text-2xl font-bold text-navy mb-6">Available Slots</h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "py-2 px-1 rounded-lg border-2 font-bold text-[11px] transition-all",
                      selectedTime === time 
                        ? "bg-gold border-gold text-navy shadow-lg shadow-gold/20 scale-105" 
                        : "border-gray-100 text-navy hover:border-gold/50"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedTime}
                onClick={() => setStep("details")}
                className="w-full bg-navy text-white disabled:bg-gray-200 font-bold py-4 rounded-xl mt-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Confirm Time
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <button onClick={() => setStep("time")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Change Time
              </button>
              <h2 className="text-2xl font-bold text-navy mb-2">Final Details</h2>
              <p className="text-gray-500 text-sm mb-8">Please provide your contact info to confirm the booking.</p>

              <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    {...register("name")}
                    placeholder="Full Name"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all",
                      errors.name ? "border-red-500" : "border-gray-100"
                    )}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    {...register("email")}
                    placeholder="Work Email"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all",
                      errors.email ? "border-red-500" : "border-gray-100"
                    )}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    {...register("phone")}
                    placeholder="Phone Number"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all",
                      errors.phone ? "border-red-500" : "border-gray-100"
                    )}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone.message}</p>}
                </div>

                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <select
                    {...register("monthlyTurnover")}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all text-sm appearance-none"
                  >
                    <option value="">Monthly Turnover (Optional)</option>
                    <option value="New Business">New Business / £0</option>
                    <option value="Under £5k">Under £5,000</option>
                    <option value="£5k - £20k">£5,000 - £20,000</option>
                    <option value="£20k - £50k">£20,000 - £50,000</option>
                    <option value="£50k - £100k">£50,000 - £100,000</option>
                    <option value="Over £100k">Over £100,000</option>
                  </select>
                </div>

                {submitError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100"
                  >
                    {submitError}
                  </motion.div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-navy text-white font-bold py-4 rounded-xl mt-4 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Schedule Appointment"}
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="flex-grow flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-4">Confirmed!</h2>
              <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                Your consultation is scheduled. Keep an eye on your inbox for the calendar invite and joining details.
              </p>
              <button 
                onClick={resetModal}
                className="mt-8 text-navy font-bold hover:underline"
              >
                Back to Site
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
