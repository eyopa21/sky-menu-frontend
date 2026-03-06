import type { NuxtApp } from '#app'

export interface PaymentMethod {
  id: number
  projectId: number
  type: string
  accountName: string
  accountNumber: string
  qrCode: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  project?: {
    id: number
    title: string
    logo: string
  }
}

export interface CreatePaymentMethodDto {
  projectId: number
  type: string
  accountName: string
  accountNumber: string
  qrCode?: string
  isActive?: boolean
}

export const paymentRepository = ($api: any) => ({
  async createPaymentMethod(data: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return await $api('/payments', {
      method: 'POST',
      body: data
    })
  },

  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return await $api('/payments')
  },

  async getPaymentMethodsByProject(projectId: number): Promise<PaymentMethod[]> {
    return await $api(`/payments/project/${projectId}`)
  },

  async getPaymentMethodById(id: number): Promise<PaymentMethod> {
    return await $api(`/payments/${id}`)
  },

  async updatePaymentMethod(id: number, data: Partial<CreatePaymentMethodDto>): Promise<PaymentMethod> {
    return await $api(`/payments/${id}`, {
      method: 'PATCH',
      body: data
    })
  },

  async deletePaymentMethod(id: number): Promise<void> {
    return await $api(`/payments/${id}`, {
      method: 'DELETE'
    })
  }
})
