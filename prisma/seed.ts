import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma";
import { MuscleGroup } from "../app/generated/prisma";
import { create } from "domain";

const prisma = new PrismaClient();

async function main() {
    const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);
    const hashedUserPassword = await bcrypt.hash("testpassword", 10);
    const muscleGroups = [
        {name:"Chest"},
        {name:"Back"},
        {name:"Arms"},
        {name:"Legs"},
        {name:"Shoulders"},
    ]
    const createdGroups: Record<string, MuscleGroup> = {};
    for (const group of muscleGroups) {
        const created = await prisma.muscleGroup.upsert({
            where: {name: group.name},
            update: {},
            create: {name: group.name}
        });
        createdGroups[group.name] = created;
    };

    await prisma.exercise.createMany({
        data: [
            {
                name: "Biceps Barbell Curls",
                imageUrl: "/exercises/arms-biceps-barbell-curls.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Incline Bench Dumbbell Curls",
                imageUrl: "/exercises/arms-biceps-dumbbell-curls-incline-bench.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Dumbbell Curls",
                imageUrl: "/exercises/arms-biceps-dumbbell-curls.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Dumbbell Hammer Curls",
                imageUrl: "/exercises/arms-biceps-dumbbell-hammer-curls.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Dumbbell Preacher Curls With One Arm",
                imageUrl: "/exercises/arms-biceps-dumbbell-preacher-curl-one-arm.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Machine Preacher Curls",
                imageUrl: "/exercises/arms-biceps-machine-preacher-curls.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Biceps Z-Bar Curls",
                imageUrl: "/exercises/arms-biceps-z-bar-curl.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps Cable Extensions",
                imageUrl: "/exercises/arms-triceps-cable-extensions.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps Machine Extensions",
                imageUrl: "/exercises/arms-triceps-machine-extensions.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps One Arm Cable Extensions",
                imageUrl: "/exercises/arms-triceps-one-arm-cable-extensions.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps One Arm Overhead Cable Extensions",
                imageUrl: "/exercises/arms-triceps-one-arm-cable-overhead-extensions.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps Overhead Barbell Extensions",
                imageUrl: "/exercises/arms-triceps-overhead-barbell-extensions.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Triceps Skullcrusher",
                imageUrl: "/exercises/arms-triceps-skullcrusher.jpg",
                muscleGroupId: createdGroups["Arms"].id
            },
            {
                name: "Barbell Row With Pronated Grip",
                imageUrl: "/exercises/back-barbell-row-pronated-grip.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Seated Cable Row With Wide Grip",
                imageUrl: "/exercises/back-cable-seated-row-wide-grip.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Seated Cable Row",
                imageUrl: "/exercises/back-cable-seated-row.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Incline Bench Dumbbell Row",
                imageUrl: "/exercises/back-dumbbell-row-incline-bench.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Lat Pulldown With Short Grip",
                imageUrl: "/exercises/back-lat-pulldown-short-grip.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Lat Pulldown",
                imageUrl: "/exercises/back-lat-pulldown.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Machine Lat Pulldown",
                imageUrl: "/exercises/back-machine-lat-pulldown.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Machine Lat Pulldown",
                imageUrl: "/exercises/back-machine-lat-pulldown.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Dumbbell Row With One Arm",
                imageUrl: "/exercises/back-one-arm-dumbbell-row.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Lat Pulldown With One Arm",
                imageUrl: "/exercises/back-one-arm-lat-pulldown.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Seated Row With One Arm",
                imageUrl: "/exercises/back-one-arm-seated-row.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Pullup With Wide Grip",
                imageUrl: "/exercises/back-pull-up-wide-grip.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Chest Bench Press",
                imageUrl: "/exercises/chest-bench-press.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Cable Flies",
                imageUrl: "/exercises/chest-cable-flies.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Dumbbell Bench Press",
                imageUrl: "/exercises/chest-dumbbell-bench-press.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Incline Bench Press Machine",
                imageUrl: "/exercises/chest-incline-bench-press-machine.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Incline Bench Press",
                imageUrl: "/exercises/chest-incline-bench-press.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Incline Dumbbell Bench Press",
                imageUrl: "/exercises/chest-incline-dumbbell-bench-press.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Press Machine",
                imageUrl: "/exercises/chest-press-machine.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Pushups",
                imageUrl: "/exercises/chest-push-up.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Chest Smith Machine Incline Bench Press",
                imageUrl: "/exercises/chest-smith-machine-incline-bench-press.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Legs Adductors Machine",
                imageUrl: "/exercises/legs-adductors-machine.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Hamstring Machine Leg Curls",
                imageUrl: "/exercises/legs-hamstring-machine-leg-curls.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Romanian Deadlift",
                imageUrl: "/exercises/legs-hamstring-romanian-deadlift.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Hamstring Seated Leg Curls",
                imageUrl: "/exercises/legs-hamstring-seated-leg-curls.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Lunges With Dumbbells",
                imageUrl: "/exercises/legs-lunges-with-dumbbells.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Pendulum Squat Machine",
                imageUrl: "/exercises/legs-pendulum-squat-machine.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Hack Squat",
                imageUrl: "/exercises/legs-quads-hack-squat.jpg",
                muscleGroupId: createdGroups["Back"].id
            },
            {
                name: "Inclined Leg Press",
                imageUrl: "/exercises/legs-quads-inclined-leg-press.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Machine Leg Extensions",
                imageUrl: "/exercises/legs-quads-machine-leg-extensions.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Barbell Squat",
                imageUrl: "/exercises/legs-quads-squat.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Smith Machine Hipthrusts",
                imageUrl: "/exercises/legs-smith-machine-hip-thrusts.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Standing Calf Raises",
                imageUrl: "/exercises/legs-standing-calf-raises.jpg",
                muscleGroupId: createdGroups["Legs"].id
            },
            {
                name: "Pec-deck flies",
                imageUrl: "/exercises/pec-deck-fly.jpg",
                muscleGroupId: createdGroups["Chest"].id
            },
            {
                name: "Shoulders Dumbbell Press",
                imageUrl: "/exercises/shoulders-dumbbell-press.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Seated Dumbbells Lateral Raises",
                imageUrl: "/exercises/shoulders-dumbbell-seated-lateral-raises.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Dumbbells Upright Row",
                imageUrl: "/exercises/shoulders-dumbbell-upright-row.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Shoulders Press Machine",
                imageUrl: "/exercises/shoulders-press-machine.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Rear Delt Cable Reverse Flies",
                imageUrl: "/exercises/shoulders-rear-delt-cable-reverse-flies.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Rear Delt Machine Flies",
                imageUrl: "/exercises/shoulders-rear-delt-machine-fly.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Shoulders Smith Machine Press",
                imageUrl: "/exercises/shoulders-smith-machine-press.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Standing Dumbbells Front Raises",
                imageUrl: "/exercises/shoulders-standing-front-raises.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
            {
                name: "Standing Dumbbells Lateral Raises",
                imageUrl: "/exercises/shoulders-standing-lateral-raises.jpg",
                muscleGroupId: createdGroups["Shoulders"].id
            },
        ]
    })
    
    await prisma.user.upsert({
        where: {
            email: "admin@gymtrack.com",
            username: "adminGymTrack"
        },
        update: {},
        create: {
            email: "admin@gymtrack.com",
            username: "adminGymTrack",
            password: hashedAdminPassword,
            role: "admin"
        }
    });
    await prisma.user.upsert({
        where: {
            email: "test@test.com",
            username: "testUser"
        },
        update: {},
        create: {
            email: "test@test.com",
            username: "testUser",
            password: hashedUserPassword,
            role: "user"
        }
    });
}

main()
  .then(() => {prisma.$disconnect()})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })