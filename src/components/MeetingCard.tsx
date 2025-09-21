
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/useMeetingActions";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const [status, setStatus] = useState(getMeetingStatus(interview))
  const { user } = useUser();
  


  useEffect(() => {
    console.log("use effect is called")
    if (status === "live" || status === "completed") return;

    debugger

    const interval = setInterval(() => {
      const now = new Date();
      const interviewTime = new Date(interview.startTime);

      if (now >= interviewTime) {
        setStatus("live");
        clearInterval(interval);
      }
    }, 50000);

    return () => clearInterval(interval);
  });


  // const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
            }
          >
            {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {status === "live" && (
          <Button className="w-full" onClick={() => joinMeeting(interview.streamCallId)}>
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}
        <div className="mt-5 w-fit flex items-center space-x-2   py-1 shadow ">
  <img
    src={user?.imageUrl}
    
    className="w-8 h-8 rounded-full object-cover border"
  />
  <span className="font-medium ">
    Interviewer: {user?.fullName?.split(" ")[0]}
  </span>
</div>
      </CardContent>
    </Card>
  );
}
export default MeetingCard;