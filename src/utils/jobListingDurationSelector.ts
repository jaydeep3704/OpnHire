
interface jobListingDurationSelectorProps{
    days:number
    price:number,
    description:string
}


export const jobListingDurationPricing:jobListingDurationSelectorProps[]=[
    {
        days:30,
        price:59,
        description:"Standard Listing"
    },
    {
        days:60,
        price:99,
        description:"Extended Visibility"
    },
    {
        days:90,
        price:129,
        description:"Maximum Exposure"
    },
]