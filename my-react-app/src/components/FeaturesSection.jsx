import {
  ChartBarIcon,
  FlagIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Real-time Tracking",
    description:
      "Monitor your calorie intake and expenditure in real-time. Stay updated with your daily progress and make adjustments as needed.",
    icon: EyeIcon, // Replace with appropriate icon
  },
  {
    name: "Personalized Goals",
    description:
      "Set and customize your fitness goals based on your personal needs and preferences. Achieve your targets with tailored recommendations.",
    icon: FlagIcon, // Replace with appropriate icon
  },
  {
    name: "Detailed Analytics",
    description:
      "Access comprehensive reports and insights into your eating habits and activity levels. Visualize your data with charts and graphs.",
    icon: ChartBarIcon, // Replace with appropriate icon
  },
  {
    name: "Nutritional Information",
    description:
      "Get detailed nutritional information about various foods. Make informed decisions about what to eat with our extensive database.",
    icon: InformationCircleIcon, // Replace with appropriate icon
  },
];

export default function FeatureSection() {
  return (
    <div id="FeaturesSection" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Track Your Fitness
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            All-in-one solution for managing your fitness journey
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Seamlessly track your calorie intake, set personalized goals, and
            gain insights into your health and nutrition. Whether you're aiming
            to lose weight, build muscle, or simply stay healthy, FitnessPro has
            you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
