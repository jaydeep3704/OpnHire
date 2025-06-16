import { XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/utils/countriesList";

const jobTypes = ["full-time", "part-time", "contract", "internship"]

export function JobFilters() {
    return (
        <Card className="col-span-1 h-fit">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
                <Button variant="destructive" size="sm" className="h-8 flex items-center">
                    <span>Clear all</span>
                    <XIcon />
                </Button>
            </CardHeader>
            <Separator className="mb-4"/>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Job Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {
                            jobTypes.map((job, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox id={job} />
                                    <Label htmlFor={job} className="text-sm font-medium">{job}</Label>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Location</Label>
                    <Select >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Location"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Worldwide</SelectLabel>
                                <SelectItem value="worldwide"><span>🌍</span><span>Worldwide/Remote</span></SelectItem>

                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>Location</SelectLabel>
                                {
                                    countryList.map((country) => (
                                        <SelectItem value={country.name} key={country.code}>
                                            <span>{country.flagEmoji}</span>
                                            <span>{country.name}</span>
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}