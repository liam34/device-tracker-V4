import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Device Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">
            The device you're looking for doesn't exist or may have been deleted.
          </p>
          <Link href="/">
            <Button>Back to Device List</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
