import { Player } from "@lottiefiles/react-lottie-player";
import dockerErrorAnimation from "@/assets/animations/docker-error.json";

export default function ErrorPage() {
  return (
    <div className="h-[100dvh] ">
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Player
          autoplay
          loop
          src={dockerErrorAnimation}
          style={{ height: "300px", width: "300px" }}
        />
        <h1 className="text-2xl font-semibold mt-4 text-red-600">
          Docker is not running
        </h1>
        <p className="mt-2 text-gray-500">
          Please make sure Docker is running before launching the app.
        </p>
      </div>
    </div>
  );
}
