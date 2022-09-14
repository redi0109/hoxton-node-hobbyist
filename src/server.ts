import PrismaClient from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

//users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { hobbies: true } });
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { hobbies: true },
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: "User not found!" });
  }
});

app.post("/users", async (req, res) => {
  const addUser = await prisma.user.create({
    data: {
      fullName: req.body.name,
      photo: req.body.photo,
      email: req.body.email,
      hobbies: {
        connectOrCreate: req.body.hobbies.map((hobby: string) => ({
          where: { name: hobby },
          create: { name: hobby },
        })),
      },
    },
    include: { hobbies: true },
  });
  res.send(addUser);
});

app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.update({
    where: { id: id },
    data: {
      fullName: req.body.name,
      photo: req.body.photo,
      email: req.body.email,
      hobbies: {
        connectOrCreate: req.body.hobbies.map((hobby: string) => ({
          where: { name: hobby },
          create: { name: hobby },
        })),
      },
    },
    include: { hobbies: true },
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: "User not found." });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deleteUser = await prisma.user.delete({
    where: { id: id },
  });
  res.send(deleteUser);
});

//hobbies
app.get("/hobbies", async (req, res) => {
  const hobbies = await prisma.hobby.findMany({ include: { user: true } });
  res.send(hobbies);
});

app.get("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.findUnique({
    where: { id: id },
    include: { users: true },
  });
  if (hobby) {
    res.send(hobby);
  } else {
    res.status(404).send({ error: "Hobby not found!" });
  }
});

app.post("/hobbies", async (req, res) => {
  const data = {
    name: req.body.name,
    image: req.body.image,
    active: req.body.active,
    users: req.body.users ? req.body.users : [],
  };

  const addHobby = await prisma.hobby.create({
    data: {
      name: data.name,
      image: data.image,
      active: data.active,
      users: {
        connectOrCreate: data.users.map((user: string) => ({
          create: { email: user },
          where: { email: user },
        })),
      },
    },
    include: { users: true },
  });
  res.send(addHobby);
});

// app.patch("/hobbies/:id", async (req, res) => {
//   const id = Number(req.params.id);
//   const hobby = await prisma.hobby.update({
//     where: { id },
//     data: req.body,
//     include: { user: true },
//   });
//   res.send(hobby);
// });

app.delete("/hobbies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const hobby = await prisma.hobby.delete({
    where: { id },
  });
  res.send(hobby);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
