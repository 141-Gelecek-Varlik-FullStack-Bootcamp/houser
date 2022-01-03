import React, { useState } from "react";
import { fetchUsers, deleteUser } from "../api";

import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Button,
  Box,
  Flex,
  Stack,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  TableCaption,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
function User({ user = user }) {
  const [params, setParams] = useState({ pageSize: 100, pageNumber: 1 });
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery(
    ["users", params.pageSize, params.pageNumber],
    () => fetchUsers(params.pageSize, params.pageNumber)
  );

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries("users"),
  });
  if (!user.isAdmin) return <Heading>User is not admin!</Heading>;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error {error.message}</div>;
  }
  if (!data.isSuccess) console.log(data.exceptionMessage);

  return (
    <Box mb={2} p={6}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Heading>Users</Heading>
        {user.isAdmin && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={1}
          >
            <Button direction={"row"} colorScheme="green">
              Add User
            </Button>
          </Stack>
        )}
      </Flex>
      {/* CHAKRA TABLE */}

      <Table mt={5} variant="simple">
        {!data.isSuccess && (
          <TableCaption> Error - ({data.exceptionMessage})</TableCaption>
        )}
        <TableCaption> Users - Total ({data.totalCount})</TableCaption>
        <Thead>
          <Tr>
            <Th textAlign="center">ID</Th>
            <Th textAlign="center">Apartment Id</Th>
            <Th textAlign="center">Name</Th>
            <Th textAlign="center">Email</Th>
            <Th textAlign="center">Phone Number</Th>
            <Th textAlign="center">Identity Number</Th>
            <Th textAlign="center">Car Plate Number</Th>
            <Th textAlign="center">Edit</Th>
            <Th textAlign="center">Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.isSuccess &&
            data.list.map((item) => (
              <Tr key={item.id}>
                <Th textAlign="center">{item.id}</Th>
                <Th textAlign="center">
                  {item.apartmentId == null ? "-" : item.apartmentId}
                </Th>
                <Th textAlign="center">{item.name}</Th>
                <Th textAlign="center">{item.email}</Th>
                <Th textAlign="center">{item.phoneNum}</Th>
                <Th textAlign="center">{item.identityNum}</Th>
                <Th textAlign="center">
                  {item.carPlateNum == null ? "-" : item.carPlateNum}
                </Th>
                <Th textAlign="center">
                  <Button size={"sm"} colorScheme={"blue"}>
                    <EditIcon />
                  </Button>
                </Th>
                <Th textAlign="center">
                  <Button
                    size={"sm"}
                    colorScheme={"red"}
                    onClick={() => {
                      deleteMutation.mutate(item.id, {
                        onSuccess: (data) => {
                          //   console.log(data);
                          !data.isSuccess
                            ? alert(data.exceptionMessage)
                            : console.log(`User with id:${item.id} deleted!`);
                        },
                      });
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Th>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default User;