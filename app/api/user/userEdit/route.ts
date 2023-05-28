import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../utils/prismadb'
import bcrypt from 'bcrypt'
import getLoggedUser from '@/app/sessions/getLoggedUser'

export async function PATCH(request: NextRequest, response: NextApiResponse) {
    try {
        const loggedUser = await getLoggedUser()
        const body = await request.json()
        const { name, oldPassword, newPassword, image } = body

        let loggedUserhashedPassword = loggedUser?.hashedPassword as string
        if (!loggedUser) {
            return NextResponse.json({ error: 'User not logged in' })
        }
        // if the old password is provided
        if (oldPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(
                oldPassword,
                loggedUser?.hashedPassword as string
            )
            console.log(isPasswordMatch)
            if (!isPasswordMatch) {
                return NextResponse.json(
                    { error: 'Old password does not match' },
                    { status: 400 }
                )
            } else {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                loggedUserhashedPassword = hashedPassword
            }
        }

        // if the name is provided
        if (name && name !== loggedUser?.name && name !== '') {
            loggedUser.name = name
        }

        // if the image is provided
        if (image) {
            loggedUser.image = image
        }

        // Update the user
        await prisma.user.update({
            where: { id: loggedUser.id },
            data: {
                name: loggedUser.name,
                hashedPassword: loggedUser.hashedPassword,
                image: loggedUser.image,
            },
        })

        return NextResponse.json({
            message: 'User profile updated successfully',
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
