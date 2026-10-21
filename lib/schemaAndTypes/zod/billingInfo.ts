import {z} from "zod"


export const billingInfoSchema = z.object({
    billingEmail: z.email(),
    billingAddress: z.string().optional(),
    paymentSetupStatus: z.enum(["Pending", "Completed", "Failed"]).optional(),
    paymentProvider: z.object({
        provider: z.enum(["Stripe"]),
        providerCustomerId: z.string(),
        providerPaymentMethodId: z.string(),
    }).optional(),

}).optional()

export type BillingInfo = z.infer<typeof billingInfoSchema>