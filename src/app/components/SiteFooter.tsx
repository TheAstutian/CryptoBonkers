import Link from "next/link";
import {headers} from '../fonts';

export const SiteFooter = () => {

    

    return (
        <>
       <footer className="border-t border-black pt-8 pb-8 pr-10 flex flex-col sm:flex-row sm:gap-4 justify-between items-start">

        <Link href="/" className="p-5">
        <h1 className={`${headers.className} md: ml-1 ml-10 text-2xl sm:text-3xl`}>The Crypto Bunkers</h1>
        </Link>

        <div className="flex flex-col sm:flex-row gap-8">
            {/*<div className="flex flex-col gap-8 px-10">
                <FooterLinkGroup
                 title="Help"
                 links={[
                   {label: "PPP Discounts", href: "##"},
                   {label: "PPP Discounts", href: "#"}
                 ]}
                 />
                 <FooterLinkGroup
                    title="Solutions"
                    links={[
                        {label: "Newsletter", href: "#"},
                        {label: "SaaS Business", href: "#"},
                        {label: "Online Courses", href: "#"}
                    ]}
                />
            </div>
            <div className="flex flex-col gap-8 px-10">
                        <FooterLinkGroup 
                    title="Integrations"
                    links={[
                        {label: "Lemon Squeezy", href: "##"},
                        {label: "Gumroad", href: "#"},
                        {label: "Stripe", href: "#"},
                        {label: "Chargebee", href: "#"},
                        {label: "Paddle", href: "#"}
                    ]}
                    />
                </div> */}
                <div className="flex flex-col gap-8 px-10">
                    <FooterLinkGroup
                    title="Links"
                    links={[
                        {label: "Twitter", href: "#"},
                        {label: "Facebook", href: "#"},
                        {label: "LinkedIn", href: "#"}, 
                    ]}
                    />
            </div>
        </div>

       </footer>
       <div>
        
       </div>
        </>
    )
}

function FooterLinkGroup ({title, links}:{title:string; links:{label:string; href:string}[]}){

    return (
        <div className="flex flex-col">
            <h3 className="font-semibold ">{title}</h3>
            <ul className="flex flex-col gap-2">
                {links.map(link=>{
                    return(
                     <Link key={link.href} href={link.href}><li className="text-sm">{link.label}</li></Link>
                    )
                })}
            </ul>
        </div>
    )
}

export default SiteFooter; 


/*
  <footer className=" container pt-16 pb-8 flex flex-col sm:flex-row sm:gap-4 justify-between items-start ">
    <Link href="/">
    <BrandLogo />
    </Link>
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-8">
          <FooterLinkGroup 
          title="Help"
          links={[
            {label: "PPP Discounts", href: "##"},
            {label: "PPP Discounts", href: "#"}
          ]}
          />
          <FooterLinkGroup
          title="Solutions"
          links={[
            {label: "Newsletter", href: "#"},
            {label: "SaaS Business", href: "#"},
            {label: "Online Courses", href: "#"}
          ]}
          />
        </div>
        <div className="flex flex-col gap-8">
          <FooterLinkGroup 
          title="Features"
          links={[
            {label: "PPP Discounts", href: "##"},
          ]}
          />
          <FooterLinkGroup 
          title="Tools"
          links={[
            {label: "Salary Converter", href: "##"},
            {label: "Coupon Generator", href: "#"},
            {label: "Stripe App", href: "#"}
          ]}
          />
          <FooterLinkGroup
          title="Company"
          links={[
            {label: "Affiliate", href: "#"},
            {label: "Twitter", href: "#"},
            {label: "Terms of Service", href: "#"}
          ]}
          />
        </div>
        <div className="flex flex-col gap-8">
          <FooterLinkGroup 
          title="Integrations"
          links={[
            {label: "Lemon Squeezy", href: "##"},
            {label: "Gumroad", href: "#"},
            {label: "Stripe", href: "#"},
            {label: "Chargebee", href: "#"},
            {label: "Paddle", href: "#"}
          ]}
          />
          <FooterLinkGroup
          title="Tutorials"
          links={[
            {label: "Newsletter", href: "#"},
            {label: "Any Website", href: "#"},
            {label: "Online Courses", href: "#"},
            {label: "Gumroad", href: "#"},
            {label: "Asake", href: "#"},
            {label: "Lover Boy", href: "#"},
            {label: "Fantastic Four", href: "#"}
          ]}
          />
        </div>
      </div>
  </footer>
  </>)
}

function PricingCard ({
  name, 
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
} : (typeof subscriptionTiersInOrder) [number] ){
  const isMostPopular = name === 'Standard' 

return (
  <Card>
  <CardHeader>
    <div className="text-accent font-semibold mb-8">{name}</div>
    <CardTitle className="text-xl font-bold">
    ${priceInCents/100}/mo
    </CardTitle>
    <CardDescription>
      {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
    </CardDescription>
  </CardHeader>
  <CardContent>
    <SignUpButton>
      <Button className="text-lg w-full rounded-lg" variant={isMostPopular? "accent" : "default"}>Get Started</Button>
    </SignUpButton>
  </CardContent>
  <CardFooter className="flex flex-col gap-4 items-start">
  <Feature className="font-bold">{maxNumberOfProducts} {" "} {maxNumberOfProducts===1? "product": "products"}</Feature>
  <Feature>PPP discounts</Feature>
  {canAccessAnalytics &&   <Feature>Advanced analytics</Feature>}
  {canRemoveBranding &&   <Feature>Remove Easy PPP branding</Feature>}
  {canCustomizeBanner &&   <Feature>Banner customization</Feature>}

  </CardFooter>
</Card> 
)
}

function Feature ({children, className} : {children: ReactNode, className?:string}) {

  return <div className={cn("flex items-center gap-2", className)}>
    <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
    <span>{children}</span>
  </div>
}

function FooterLinkGroup ({title, links}: {title:string, links: {label:string; href:string}[]}){
  return <div className=" flex flex-col gap-4">
    <h3 className="font-semibold">{title}</h3>
    <ul className="flex flex-col gap-2 text-sm">
      {links.map(link=>(
        <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
      ))}
    </ul>
  </div>

}
//bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_100%)]*/