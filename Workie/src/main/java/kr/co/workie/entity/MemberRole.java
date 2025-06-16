package kr.co.workie.entity;

/**
 * 채널 멤버의 역할을 정의하는 enum
 */
public enum MemberRole {
    OWNER("소유자"),
    ADMIN("관리자"),
    MEMBER("일반멤버");

    private final String description;

    MemberRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return description;
    }
}