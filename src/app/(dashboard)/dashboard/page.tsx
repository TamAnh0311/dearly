/**
 * Dashboard home — landing page after login.
 * Shows overview/setup wizard if no wedding exists yet.
 */

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-dearly-text">Welcome to Dearly</h1>
      <p className="mt-3 text-dearly-text-secondary">
        Start by heading to the Editor to pick a template and set up your wedding site.
      </p>
    </div>
  );
}
