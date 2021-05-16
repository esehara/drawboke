import { Box, Center, Flex, Stack, Text } from "@chakra-ui/react"

export function LoginPage() {
    return (
        <Flex m={6} width="full">
            <Center width="full">
                <Box 
                    borderRadius="md"
                    textAlign="center" 
                    bg="white" 
                    p={6} >
                    <Stack spacing={2}>
                        <Text fontSize="5xl">ようこそ、DrawBoke</Text>
                        <Text fontSize="5xl">絵と言葉で繋がる遊び場へ</Text>
                    </Stack>
                </Box>
            </Center>
        </Flex>
    )
}