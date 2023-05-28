import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../utils/prismadb'
import getLoggedUser from '@/app/sessions/getLoggedUser'
import bcrypt from 'bcrypt'

export async function DELETE(
    request: NextRequest,
    {
        params,
    }: {
        params: { password: string }
    }
) {
    const { password } = params

    const loggedUser = await getLoggedUser()

    if (!loggedUser) {
        return NextResponse.json(
            { error: 'You must be logged in to delete your profile' },
            { status: 401 }
        )
    }

    // Fetch the user to check if the password is correct
    const user: any = await prisma.user.findUnique({
        where: { id: loggedUser.id },
        include: { accounts: true },
    })

    // If the user has logged in with a provider, delete the account
    if (user.accounts.length > 0) {
        await prisma.permissionRequest.deleteMany({
            where: { toUserId: loggedUser.id },
        })

        // Delete the user's profile
        const deletedUser = await prisma.user.delete({
            where: { id: loggedUser.id },
        })

        return NextResponse.json(deletedUser, { status: 200 })
    }
    // If the user has not logged in with a provider, check the password
    else {
        const isCorrectPassword = await bcrypt.compare(
            password,
            user.hashedPassword
        )
        if (!isCorrectPassword) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 403 }
            )
        }

        await prisma.permissionRequest.deleteMany({
            where: { toUserId: loggedUser.id },
        })

        // Delete the user's profile
        const deletedUser = await prisma.user.delete({
            where: { id: loggedUser.id },
        })

        return NextResponse.json(deletedUser, { status: 200 })
    }
}
