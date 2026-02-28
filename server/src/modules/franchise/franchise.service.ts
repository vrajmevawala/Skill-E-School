import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class FranchiseService {
    static async createInquiry(data: any) {
        return prisma.franchiseInquiry.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                city: data.city,
                message: data.message,
            },
        });
    }

    static async getDashboard(userId: string) {
        const partner = await prisma.franchisePartner.findUnique({
            where: { userId },
        });

        if (!partner) throw new AppError("Franchise partner profile not found", 404);

        const [leadsCount, totalCommission] = await Promise.all([
            prisma.franchiseLead.count({ where: { partnerId: partner.id } }),
            prisma.commission.aggregate({
                where: { partnerId: partner.id },
                _sum: { amount: true },
            }),
        ]);

        // Mocking some growth trends for the dashboard
        return {
            stats: {
                totalLeads: leadsCount,
                monthlyEarnings: totalCommission._sum.amount || 0,
                growth: "12%",
            },
            partner,
        };
    }

    static async getLeads(userId: string) {
        const partner = await prisma.franchisePartner.findUnique({
            where: { userId },
        });
        if (!partner) throw new AppError("Franchise partner profile not found", 404);

        return prisma.franchiseLead.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getPayouts(userId: string) {
        return prisma.payout.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getAllInquiries() {
        return prisma.franchiseInquiry.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    static async updateInquiryStatus(id: string, status: any) {
        return prisma.franchiseInquiry.update({
            where: { id },
            data: { status },
        });
    }

    static async getAllPartners() {
        return prisma.franchisePartner.findMany({
            include: {
                user: { include: { profile: true } },
            },
        });
    }
}
