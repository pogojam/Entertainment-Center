import { Box, Card, Form, Grid, Main, Text, TextInput } from "grommet";

const Login = () => {
  return (
    <Box basis="100%" justify="center" align="center">
      <Card background="light-1">
        <Form>
          <Grid gap={"medium"} pad={"medium"}>
            <Text>Login</Text>
            <TextInput placeholder="Username" />
            <TextInput placeholder="Password" />
          </Grid>
        </Form>
      </Card>
    </Box>
  );
};

export default Login;
