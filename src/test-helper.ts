let lastFixture: any = null;

export function makeTestFixture() {
    let fixture = document.createElement("div");
    document.body.appendChild(fixture);
    if (lastFixture) {
        lastFixture.remove();
    }
    lastFixture = fixture;
    return fixture;
}

export async function nextTick() {
    await new Promise((resolve) => setTimeout(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
}