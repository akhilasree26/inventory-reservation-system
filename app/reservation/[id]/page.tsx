"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReservationPage() {

  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchReservation() {

    try {

      const response = await fetch(
        `/api/reservations/${params.id}`
      );

      const data = await response.json();

      setReservation(data);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {

    if (!reservation) return;

    const interval = setInterval(() => {

      const now = new Date().getTime();

      const expiry = new Date(
        reservation.expiresAt
      ).getTime();

      const difference = expiry - now;

      if (difference <= 0) {

        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(
        difference / 1000 / 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft(`${minutes}m ${seconds}s`);

    }, 1000);

    return () => clearInterval(interval);

  }, [reservation]);

  async function confirmReservation() {

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        `/api/reservations/${params.id}/confirm`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setMessage("Purchase confirmed successfully!");

      fetchReservation();

    } catch (error) {

      setMessage("Confirmation failed");

    } finally {

      setLoading(false);
    }
  }

  async function cancelReservation() {

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        `/api/reservations/${params.id}/release`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 410) {
          setMessage(
            "Reservation expired. Please reserve again."
          );
        }else {
          setMessage(data.error);
        }
        return;
      }

      setMessage("Reservation cancelled");

      fetchReservation();

    } catch (error) {

      setMessage("Cancellation failed");

    } finally {

      setLoading(false);
    }
  }

  if (!reservation) {

    return (
      <div className="p-10 text-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200 p-6 flex items-center justify-center">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl">

        <h1 className="text-4xl font-bold mb-6 text-center">
          Reservation Checkout
        </h1>

        <div className="space-y-5">

          <div className="bg-gray-100 rounded-2xl p-5">

            <p className="text-lg">
              <strong>Reservation ID:</strong>
            </p>

            <p className="text-gray-700 break-all">
              {reservation.id}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-100 rounded-2xl p-5">

              <p className="text-gray-500">
                Quantity
              </p>

              <p className="text-3xl font-bold">
                {reservation.quantity}
              </p>

            </div>

            <div className="bg-gray-100 rounded-2xl p-5">

              <p className="text-gray-500">
                Status
              </p>

              <p className="text-2xl font-bold">
                {reservation.status}
              </p>

            </div>

          </div>

          <div className="bg-black text-white rounded-2xl p-6 text-center">

            <p className="text-lg mb-2">
              Reservation Expires In
            </p>

            <p className="text-5xl font-bold">
              {timeLeft}
            </p>

          </div>

          {message && (

            <div className="bg-gray-100 rounded-2xl p-4 text-center font-semibold">

              {message}

            </div>
          )}

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={confirmReservation}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold"
            >
              Confirm Purchase
            </button>

            <button
              onClick={cancelReservation}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-lg font-semibold"
            >
              Cancel Reservation
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}