import { visit } from "../lib/test-helpers"
import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import makeServer from "../server"
import userEvent from "@testing-library/user-event"
let server

beforeEach(() => {
    server = makeServer("test")
})

afterEach(() => {
    server.shutdown()
})

test("it shows a message when there are no reminders", async () => {
    visit("/")

    await waitForElementToBeRemoved(() => screen.getByText("Loading..."))

    expect(screen.getByText("All done!")).toBeInTheDocument()
})

test("it shows existing reminders", async () => {
    server.create("reminder", { text: "Walk the dog" })
    server.create("reminder", { text: "Take out the trash" })
    server.create("reminder", { text: "Work out" })

    visit("/")
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."))

    expect(screen.getByText("Walk the dog")).toBeInTheDocument()
    expect(screen.getByText("Take out the trash")).toBeInTheDocument()
    expect(screen.getByText("Work out")).toBeInTheDocument()
})

test("it can add a reminder to a list", async () => {
    let list = server.create("list")

    visit(`/${list.id}`)
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."))

    userEvent.click(screen.getByTestId("add-reminder"))
    await userEvent.type(screen.getByTestId("new-reminder-text"), "Work out")
    userEvent.click(screen.getByTestId("save-new-reminder"))
})