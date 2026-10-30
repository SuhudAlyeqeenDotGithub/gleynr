
import {z} from "zod"



export const billingInfoSchema = z.object({
    id: z.string(),
    organisationId: z.string(),
    status: z.enum(["Active", "Inactive", "Suspended"]),
    email: z.email(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    paymentSetupStatus: z.enum(["Pending", "Completed", "Failed"]).optional(),
    paymentProvider: z.object({
        provider: z.enum(["Stripe"]),
        providerCustomerId: z.string(),
        providerPaymentMethodId: z.string(),
    }).optional(),

})

export type BillingInfo = z.infer<typeof billingInfoSchema>